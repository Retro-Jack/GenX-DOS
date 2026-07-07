/* file_headless.c — GenX-DOS WASM port of VirtualT.
 *
 * The Model 100 file loader, extracted verbatim from file.cpp (relocate,
 * tokenize, find_file_in_directory, update_file_offsets, delete_file,
 * cb_LoadFromHost, remote_load_from_host) so a host .CO/.BA/.DO can be injected
 * into the emulated M100 RAM filesystem without the FLTK GUI. Compiled as C so
 * the VirtualT headers' FLTK (#ifdef __cplusplus) sections stay excluded, like
 * the rest of the core. The few cosmetic FLTK calls are macro-replaced below.
 */
#include <sys/types.h>
#include <ctype.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "VirtualT.h"
#include "memory.h"
#include "roms.h"
#include "intelhex.h"
#include "m100emu.h"

/* Cosmetic FLTK calls the loader made, neutralised for headless use: */
#define FL_CURSOR_WAIT      0
#define FL_CURSOR_DEFAULT   0
#define fl_cursor(x)        ((void)0)
#define fl_message(...)     fprintf(stderr, __VA_ARGS__)
#define fl_choice(...)      1   /* auto-answer "Yes": replace an existing file */
#define fl_filename_name(p) (strrchr((p), '/') ? strrchr((p), '/') + 1 : (p))

int gLoadError;   /* load error flag (remote/headless interface) */
void fileview_model_changed(void);   /* stubs.c — prototype so the direct call
                                        matches the definition (else wasm traps) */
void jump_to_zero(void);             /* m100emu.c — resets the CPU (PC=0) */
#define TYPE_DO 0xC0
#define TYPE_CO 0xA0
#define TYPE_BA 0x80
#define TYPE_HEX 0x40

const char			*gIllformedBasic = "Ill formed BASIC file";
static const char		*gTooLargeMsg = "File too large for available memory";

const char *gKeywordTable[] = {
	"END",    "FOR",   "NEXT",  "DATA",    "INPUT", "DIM",    "READ",   "LET",
	"GOTO",	  "RUN",   "IF",    "RESTORE", "GOSUB", "RETURN", "REM",    "STOP",
	"WIDTH",  "ELSE",  "LINE",  "EDIT",    "ERROR", "RESUME", "OUT",    "ON",
	"DSKO$",  "OPEN",  "CLOSE", "LOAD",    "MERGE", "FILES",  "SAVE",   "LFILES",
	"LPRINT", "DEF",   "POKE",	"PRINT",   "CONT",  "LIST",   "LLIST",  "CLEAR",
	"CLOAD",  "CSAVE", "TIME$", "DATE$",   "DAY$",  "COM",    "MDM",    "KEY",
	"CLS",    "BEEP",  "SOUND", "LCOPY",   "PSET",  "PRESET", "MOTOR",  "MAX",
	"POWER",  "CALL",  "MENU",  "IPL",     "NAME",  "KILL",   "SCREEN", "NEW",

// ==========================================
// Function keyword table TAB to <
// ==========================================
	"TAB(",   "TO",    "USING", "VARPTR",  "ERL",   "ERR",    "STRING$","INSTR",
	"DSKI$",  "INKEY$","CSRLIN","OFF",     "HIMEM", "THEN",   "NOT",    "STEP",
	"+",      "-",     "*",     "/",       "^",     "AND",    "OR",     "XOR",
	"EQV",    "IMP",   "MOD",   "\\",      ">",     "=",      "<",

// ==========================================
// Function keyword table SGN to MID$
// ==========================================
	"SGN",    "INT",   "ABS",   "FRE",     "INP",   "LPOS",   "POS",    "SQR",
	"RND",    "LOG",   "EXP",   "COS",     "SIN",   "TAN",    "ATN",    "PEEK",
	"EOF",    "LOC",   "LOF",   "CINT",    "CSNG",  "CDBL",   "FIX",    "LEN",
	"STR$",   "VAL",   "ASC",   "CHR$",    "SPACE$","LEFT$",  "RIGHT$", "MID$",

// End of table marker
	""
};

int relocate(unsigned char* in, unsigned char* out, unsigned short addr)
{
	int				c;
	unsigned short	next_line;
	unsigned short	this_line;
	int				line_number;
	int				line_len;
	unsigned short	addr1;
	unsigned short	base;

	next_line = 1;;
	this_line = 0;
	c = 0;
	line_number = -1;

	// Get pointer to next line
	next_line = ((unsigned short) in[c+1] << 8) + (unsigned short) in[c];
	line_len =0;
	base = in[0] + (in[1] << 8);
	while (next_line != 0)
	{
		c += 2;				// Skip next line pointer
		line_len += 2;		// Update BASIC line length

		if (in[c] + (in[c+1] << 8) <= line_number)
		{
			fl_message("1: %s", gIllformedBasic);
			return 0;
		}

		line_number = in[c] + (in[c+1] << 8);

		out[c] = in[c];		// Copy low byte of line number
		c++;
		line_len++;
		out[c] = in[c];		// Copy high byte of line number
		c++;
		line_len++;

		// Copy tokenized line
		if (gModel == MODEL_PC8201 || gModel == MODEL_PC8300)
		{
			// For MODEL_PC8201 or PC8300, the line can have embedded
			// zeros.  This is because integer numbers are encoded as 3
			// bytes:  0x0E  LSB MSB
			// So for a value of say, 256, the LSB would be zero.
			while (in[c] != 0)
			{
				// Test for 0x0E encoding
				if (in[c] == 0x0E || in[c] == 0x1C || in[c] == 0x1D)
				{
					int encoding = in[c];

					// Copy this byte and the next directly
					out[c] = in[c];
					c++;
					out[c] = in[c];
					c++;
					line_len += 2;

					// The 0x1D encoding is 4 bytes
					if (encoding == 0x1D)
					{
						// Copy this byte and the next directly
						out[c] = in[c];
						c++;
						out[c] = in[c];
						c++;
						line_len += 2;
					}
				}

				out[c] = in[c];
				c++;
				line_len++;
			}
		}
		else
		{
			// Each line is terminated with a zero
			while (in[c] != 0)
			{
				out[c] = in[c];
				c++;
				line_len++;
			}
		}

		out[c] = in[c];		// Copy terminating zero
		c++;
		line_len++;

		// Update pointer to next line (of line just copied)
		out[this_line] = (addr + c) & 0xFF;
		out[this_line+1] = (addr + c) >> 8;

		// Validate the line pointers are valid
		if (this_line != 0)
		{
			addr1 = in[this_line] + (in[this_line+1] << 8);
			if (addr1 != base + line_len)
			{
				fl_message("2: %s", gIllformedBasic);
				return 0;
			}
		}

		// Update location where next pointer will be stored
		base = in[this_line] + (in[this_line+1] << 8);
		this_line = c;

		// Get pointer to next line
		next_line = ((unsigned short) in[c+1] << 8) + (unsigned short) in[c];
		line_len = 0;
	}

	// Copy terminating 0x0000 to out
	out[c++] = 0;
	out[c++] = 0;

	return c;
}

/*
=======================================================
This is the tokenizer that converts ASCII mode BASIC files
to actual .BA files in the Model 100/102/200 format.
=======================================================
*/
#define	STATE_LINENUM	1
#define	STATE_WHITE		2
#define	STATE_TOKENIZE	3
#define	STATE_CR		4

int tokenize(unsigned char* in, unsigned char* out, unsigned short addr)
{
	int				state;
	int				c, x;
	unsigned short	line_num;
	int				line_num_len;
	unsigned char	tok_line[256];
	int				line_len;
	unsigned char	token;
	int				tok_len;
	int				out_len;
	int				last_line_num;
	int				next_line_offset;

	c = 0;
	line_num = 0;
	line_num_len = 0;
	line_len = 0;
	out_len = 0;
	last_line_num = -1;
	next_line_offset = 0;
	state = STATE_LINENUM;

	// Initialize out array with a blank line
	out[0] = 0;
	out[1] = 0;

	// Parse until end of string
	while ((in[c] != 0) && (in[c] != 0x1A))
	{
		switch (state)
		{
		// Read linenumber until non numeric
		case STATE_LINENUM:
			if ((in[c] < '0') || (in[c] > '9'))
			{
				// Check for blank lines
				if ((in[c] == 0x0d) || (in[c] == 0x0a))
				{
					// Skip this character
					c++;
				}
				// Check for characters with no line number
				else if (line_num_len == 0)
				{
					fl_message("3: %s", gIllformedBasic);
					return 0;
				}

				// First space not added to output - skip it
				if (in[c] == ' ')
					c++;

				// Line number found, go to tokenize state
				state = STATE_TOKENIZE;
			}
			else
			{
				// Add byte to line number
				line_num = line_num * 10 + in[c] - '0';
				line_num_len++;
				c++;
			}
			break;

		case STATE_TOKENIZE:
			// Check for '?' and assign to PRINT
			if (in[c] == '?')
			{
				tok_line[line_len++] = 0xA3;
				c++;
			}
			// Check for REM tick
			else if (in[c] == '\'')
			{
				tok_line[line_len++] = ':';
				tok_line[line_len++] = 14 | 0x80;
				c++;
				tok_line[line_len++] = 0xFF;

				// Copy bytes to token line until 0x0D or 0x0A
				while ((in[c] != 0x0d) && (in[c] != 0x0a)
					&& (in[c] != 0))
				{
					tok_line[line_len++] = in[c++];
				}
			}
			// Check for characters greater than 127 and skip
			else if ((in[c] > 127) || (in[c] == 0x0d))
			{
				c++;
			}
			// Check for quote
			else if (in[c] == '"')
			{
				tok_line[line_len++] = in[c++];
				// Copy bytes to token line until quote ended
				while ((in[c] != '"') && (in[c] != 0x0d) && (in[c] != 0x0a)
					&& (in[c] != 0))
				{
					tok_line[line_len++] = in[c++];
				}

				// Add trailing quote to tok_line
				if (in[c] == '"')
					tok_line[line_len++] = in[c++];
			}
			// Check for end of line
			else if (in[c] == 0x0a)
			{
				// Skip this byte - don't add it to the line
				c++;

				if (line_len != 0)
				{
					// Add line to output
					if (line_num > last_line_num)
					{
						// Add line to end of output
						out[next_line_offset] = (addr + next_line_offset + 5 + line_len) & 0xFF;
						out[next_line_offset] = (addr + next_line_offset + 5 + line_len) >> 8;
						next_line_offset += 2;

						// Add line number
						out[next_line_offset++] = line_num & 0xFF;
						out[next_line_offset++] = line_num >> 8;

						// Add tokenized line
						for (x = 0; x < line_len; x++)
							out[next_line_offset++] = tok_line[x];

						// Add terminating zero
						out[next_line_offset++] = 0;

						// Add 0x0000 as next line number offset
						out[next_line_offset] = 0;
						out[next_line_offset+1] = 0;

						// Update out_len to reflect current length
						out_len += line_len + 5;

						// Update last_line_num
						last_line_num = line_num;

					}
					else
					{
						// Add line somewhere in the middle

						// NEED TO ADD CODE HERE!!!!!
					}
				}
				state = STATE_LINENUM;
				line_len = 0;
				line_num = 0;
			}
			// Add '0' through ';' to tokenized line "as-is"
			else if ((in[c] >= '0') && (in[c] <= ';'))
			{
				tok_line[line_len++] = in[c++];
			}
			else
			{
				// Search token table for match
				for (token = 0; strlen(gKeywordTable[token]) != 0; token++)
				{
					tok_len = strlen(gKeywordTable[token]);
					// Compare next Keyword with input
					if (strncmp(gKeywordTable[token], (char *) &in[c], 
						tok_len) == 0)
					{
						// Add ':' prior to ELSE if not already there
						if ((token == 17) && (tok_line[line_len-1] != ':'))
						{
							tok_line[line_len++] = ':';
						}
						tok_line[line_len++] = token + 0x80;
						c += tok_len;

						// If REM token, add bytes to end of line 
						if (token == 14)
						{
							// Copy bytes to token line until 0x0D or 0x0A
							while ((in[c] != 0x0d) && (in[c] != 0x0a)
								&& (in[c] != 0))
							{
								tok_line[line_len++] = in[c++];
							}
						}

						// If DATA token, add bytes to EOL or ':'
						if (token == 3)
						{
							// Copy bytes to token line until 0x0D or 0x0A
							while ((in[c] != ':') && (in[c] != 0x0d) && (in[c] != 0x0a)
								&& (in[c] != 0))
							{
								tok_line[line_len++] = in[c++];
							}
						}
						break;
					}
				}

				// Check if token not found - add byte directly
				if (token == 0x7F)
				{
					tok_line[line_len++] = in[c++];
				}
			}
			break;
		}
	}

	return out_len + 2;
}

/*
=======================================================
Find the address of directory entry for the specified file.
=======================================================
*/
unsigned short find_file_in_directory(const char* filename)
{
	unsigned short 	addr;
	int				dir_index, x;

	// Determine if file alaready exists in directory
	addr = gStdRomDesc->sDirectory;
	dir_index = 0;
	while (dir_index < gStdRomDesc->sDirCount)
	{
		// Test if this slot is empty
		if ((get_memory8(addr) & 0x80) == 0)
		{
			addr += 11;
			dir_index++;
			continue;
		}

		// Compare this entry to the file being added
		for (x = 0; x < 8; x++)
		{
			if (get_memory8(addr + 3 + x) != filename[x])
				break;
		}

		// Test if we matched the file (i.e. it exists already)
		if (x == 8)
		{
			// File return the address
			return addr;
		}

		// Advance to next file in directory
		addr += 11;
		dir_index++;
	}

	// File not found, return address of zero
	return 0;
}

/*
=======================================================
Add an offset to all entries in the directory whose
file content is higher in memory than the specified
address.
=======================================================
*/
void update_file_offsets(unsigned short start_addr, int len)
{
	unsigned short	dir_addr;
	unsigned short	file_addr;
	int				dir_index;

	// Update existing Directory entry addresses
	dir_addr = gStdRomDesc->sDirectory;
	dir_index = 0;
	while (dir_index < gStdRomDesc->sDirCount)
	{
		// Check if this entry is active
		if (get_memory8(dir_addr) == 0)
		{
			dir_addr += 11;
			dir_index++;
			continue;
		}

		// Get address of this file
		file_addr = get_memory16(dir_addr + 1);
		
		// Check if file moved
		if (file_addr >= start_addr)
			set_memory16(dir_addr + 1, file_addr + len);

		dir_addr += 11;   
		dir_index++;
	}
}

/*
=======================================================
Routine to load files from host into the emulation.
=======================================================
*/
int delete_file(const char* filename, unsigned short dir_addr)
{
	unsigned short	file_addr;	// Address of file data
	unsigned short	len;
	unsigned short	tmp_addr;
	unsigned short	reloc_addr;
	int				file_type, dir_index;
	int				x, i;
	char			mt_file[10];

	// First determine if an address was given.  If not, find it
	if (dir_addr == 0)
	{
		// Convert filename to MT format
		i = 0;
		if (filename[i] == '"')
			i++;
		for (x = 0; x < 6; x++)
		{
			if  (filename[i] == '.' || filename[i] == '"')
				mt_file[x] = ' ';
			else
				mt_file[x] = toupper(filename[i++]);
		}
		if (filename[i] == '.')
			i++;
		for (; x < 8; x++)
		{
			if (filename[i] == '\0' || filename[i] == '"')
				mt_file[x] = ' ';
			else
				mt_file[x] = toupper(filename[i++]);
		}

		// Find the filename in the directory
		dir_addr = find_file_in_directory(mt_file);
		if (dir_addr == 0)
			return 0;
	}

	// Get the file address
	file_addr = get_memory16(dir_addr + 1);

	// Determine length of file being deleted
	len = 0;
	tmp_addr = file_addr;
	if (get_memory8(dir_addr + 3 + 6) == 'D')
	{
		// Set the file type to .DO
		file_type = TYPE_DO;

		// Find end of .DO file
		while (get_memory8(tmp_addr) != 0x1A)
		{
			len++;
			tmp_addr++;
		}
		// Include terminating 0x1A in length
		len++;
	}
	else if (get_memory8(dir_addr + 3 + 6) == 'C')
	{
		// Set the file type to .CO
		file_type = TYPE_CO;

		// Deleting a binary file
		len = get_memory16(file_addr + 2) + 6;
	}
	else
	{
		// Set the file type to .BA
		file_type = TYPE_BA;

		// Must be a BASIC file, but validate that
		if (get_memory8(dir_addr + 3 + 6) != 'B')
		{
			// ERROR!  TODO: Report it somehow!!
			return 0;
		}

		// Yep, it's a BASIC file.  Find end of BASIC program
		while (get_memory16(tmp_addr) != 0)
			tmp_addr = get_memory16(tmp_addr);

		// Be sure to include the terminating 0x0000 in the length
		len = tmp_addr - file_addr + 2;
	}

	// Delete the file from the directory (mark it invalid)
	set_memory8(dir_addr, 0);

	// Move files and variable data after this file (i.e. higher in 
	// memory space) to delete it from the "file system"
	int move_len = get_memory16(gStdRomDesc->sUnusedMem) - (file_addr + len);
	for (x = 0; x < move_len; x++)
		set_memory8(file_addr + x, get_memory8(file_addr + len + x)); 

	// Update existing Directory entry addresses
	update_file_offsets(file_addr, -len);

	// Update pointers of all BASIC programs
	dir_addr = gStdRomDesc->sDirectory;
	dir_index = 0;
	while (dir_index < gStdRomDesc->sDirCount)
	{
		// Check if this entry is active
		if (get_memory8(dir_addr) != TYPE_BA)
		{
			dir_addr += 11;
			dir_index++;
			continue;
		}

		// Get address of this file
		reloc_addr = get_memory16(dir_addr + 1);
		if (reloc_addr >= file_addr)
		{
			// Update BASIC pointers for this file
			while (get_memory16(reloc_addr) != 0)
			{
				// Subtract len from current pointer
				set_memory16(reloc_addr, get_memory16(reloc_addr) - len);

				// Get pointer to next line
				reloc_addr = get_memory16(reloc_addr);
			}
		}

		// Advance to next entry in directory
		dir_addr += 11;   
		dir_index++;
	}

	// If a .BA file was added, renumber the address
	// pointers in any "unsaved" BASIC program that
	// may exist.
	if (file_type == TYPE_BA)
	{
		// Update BASIC pointers for the Unsaved BASIC program
		reloc_addr = get_memory16(gStdRomDesc->sFilePtrBA);

		while (get_memory16(reloc_addr) != 0)
		{
			set_memory16(reloc_addr, get_memory16(reloc_addr)-len);
			reloc_addr = get_memory16(reloc_addr);
		}
	}

	// Update system pointers
	reloc_addr = get_memory16(gStdRomDesc->sBeginArray);
	if (reloc_addr >= file_addr)
		set_memory16(gStdRomDesc->sBeginArray, reloc_addr - len);

	if ((file_type != TYPE_CO) || (file_type == TYPE_HEX))
	{
		reloc_addr = get_memory16(gStdRomDesc->sBeginCO);
		if (reloc_addr > file_addr)
			set_memory16(gStdRomDesc->sBeginCO, reloc_addr - len);
	}

	// If we deleted a BASIC file, then update the beginning of .DO file pointer
	if (file_type == TYPE_BA)
	{
		/* Update beginning of .DO file pointer */
		reloc_addr = get_memory16(gStdRomDesc->sBeginDO);
		if (reloc_addr > file_addr)
			set_memory16(gStdRomDesc->sBeginDO, reloc_addr - len);

		/* Update BASIC size variable */
		reloc_addr = get_memory16(gStdRomDesc->sBasicSize);
		set_memory16(gStdRomDesc->sBasicSize, reloc_addr - (len-2));
		//set_memory16(gStdRomDesc->sBasicSize, reloc_addr - len);
	}

	// Update beginning of variable space pointer
	reloc_addr = get_memory16(gStdRomDesc->sBeginVar);
	if (reloc_addr >= file_addr)
		set_memory16(gStdRomDesc->sBeginVar, reloc_addr - len);

	// Update unused memory variable
	reloc_addr = get_memory16(gStdRomDesc->sUnusedMem);
	if (reloc_addr >= file_addr)
		set_memory16(gStdRomDesc->sUnusedMem, reloc_addr - len);

	// Update file view if open
	fileview_model_changed();

	// Reset the system so file will show up
	jump_to_zero();

	// Indicate file deleted successfully
	return 1;
}

/*
=======================================================
Routine to load files from host into the emulation.
=======================================================
*/
void cb_LoadFromHost(void* w, void* host_filename)
{
	int					count, i, x;
	const char			*filename;
	const char			*filename_name;
	char                mt_file[8];
	int					len;
	FILE				*fd;
	int					file_type;
	unsigned char		data[262144];
	unsigned char		conv[32768];
	unsigned short		start_addr;
	char				ch;
	unsigned short		addr1, addr2, addr3, addr4;
	int					dir_index;
	int                 move_len;
	int					need_tokenize;
	
	if (host_filename == NULL)
		return;

	filename = (const char*) host_filename;
	len = strlen(filename);

	// Open file
	fd = fopen(filename, "rb");
	if (fd == 0)
	{
		if (w != NULL)
			fl_message("Unable to open file %s", filename);
		else
			gLoadError = 1;
		return;
	}

	// Determine type of file
	file_type = TYPE_DO;
	if (((filename[len-1] | 0x20) == 'o') &&
		((filename[len-2] | 0x20) == 'c'))
			file_type = TYPE_CO;
	// Deal with other binary types
	if (((filename[len-2] | 0x20) == 'c') &&
		(filename[len-3] == '.'))
			file_type = TYPE_CO;
	if (((filename[len-1] | 0x20) == 'a') &&
		((filename[len-2] | 0x20) == 'b'))
			file_type = TYPE_BA;
	if (((filename[len-1] | 0x20) == 'x') &&
		((filename[len-2] | 0x20) == 'e') &&
		((filename[len-3] | 0x20) == 'h'))
			file_type = TYPE_HEX;

	// Convert filename to Model T name
	filename_name = fl_filename_name(filename);
	i = 0;
	for (x = 0; x < 6; x++)
	{
		if (filename_name[i] == '.')
			mt_file[x] = ' ';
		else
			mt_file[x] = toupper(filename_name[i++]);
	}
	if (file_type == TYPE_BA)
	{
		mt_file[6] = 'B';
		mt_file[7] = 'A';
	}
	else if (file_type == TYPE_DO)
	{
		mt_file[6] = 'D';
		mt_file[7] = 'O';
	}
	else if (file_type == TYPE_CO)
	{
		mt_file[6] = 'C';
		mt_file[7] = toupper(filename[len-1]);
	}	
	else if (file_type == TYPE_HEX)
	{
		mt_file[6] = 'C';
		mt_file[7] = 'O';
	}	
	
	// Determine "RAW" length of file (w/o CRLF expansion)
	fseek(fd, 0, SEEK_END);
	len = ftell(fd);
	if (len > 262144)
	{
		fclose(fd);
		if (w != NULL)
			fl_message("%s", gTooLargeMsg);
		else
			gLoadError = 1;
		return;
	}

	// Read contents to buffer
	fseek(fd, 0, SEEK_SET);
	int readlen = fread(data, 1, len, fd);

	// Close the file
	fclose(fd);

  if (readlen == 0)
    return;

	// Determine file location
	if (file_type == TYPE_BA)
	{
		addr1 = get_memory16(gStdRomDesc->sFilePtrBA);
	}
	else if ((file_type == TYPE_CO) || (file_type == TYPE_HEX))
	{
		addr1 = get_memory16(gStdRomDesc->sBeginVar);
	} 
	else if (file_type == TYPE_DO)
	{
		addr1 = get_memory16(gStdRomDesc->sFilePtrDO);
	}
  else
    return;

	// Determine length of data and expand LF to CRLF
	if (file_type == TYPE_DO)
	{
		i=x=ch=0;
		while (i < len)
		{
			if ((data[i] == 0x0A) && (ch != 0x0D))
				conv[x++] = 0x0D;
			ch = data[i++];
			conv[x++] = ch;
			if (x >= 32768)
			{
				if (w != NULL)
					fl_message("%s", gTooLargeMsg);
				else
					gLoadError = 1;
				return;
			}
		}

		if (ch != 0x1A)
		{
			conv[x++] = 0x1A;
		}

		len = x;
	}
	// For BASIC files, determine if tokenization required
	else if (file_type == TYPE_BA)
	{
		need_tokenize = 1;

		// Check first 10 bytes searching for control characters
		for (x = 0; x < 10; x++)
		{
			if (iscntrl(data[x]) && (data[x] != 0x0d) && (data[x] != 0x0a))
			{
				need_tokenize = 0;
				break;
			}
		}

		if (need_tokenize)
		{
			// Insure file ends with CR
			data[len] = 0x0a;
			data[len+1] = 0;

			// Tokenize the file & locate at addr1
			len = tokenize(data, conv, addr1);
		}
		else
		{
			// Insure tokenized file ends with 0x0000
			data[len] = 0;
			data[len+1] = 0;

			// Relocate to new address
			len = relocate(data, conv, addr1);
		}
	}
	// For HEX files, load the hex file into conv to get length
	else if (file_type == TYPE_HEX)
	{
		len = load_hex_file((char *)  filename, (char *) data, &start_addr);
		if (len == 0)
		{
			if (w != NULL)
				fl_message("Invalid HEX file format");
			else
				gLoadError = 1;
		}
	}

	// Dont add zero length files
	if (len == 0)
	{
		return;
	}

	// Determine if file alaready exists in directory
	addr2 = find_file_in_directory(mt_file);
	if (addr2 != 0)
	{
		// File exists.  If we are calling from the menu, validate they want to replace
		if (w != NULL)
		{
			int ans = fl_choice("Replace existing file?", "Cancel", "Yes", NULL);

			// Test if "Cancel" was selected
			if (ans == 0)
			{
				return;
			}
		}

		// Delete the file
		if (!delete_file(mt_file, addr2))
		{
			// Could not delete the file for some reason??
			gLoadError = 1;
            return;
		}
	}

	// Determine file location
	if (file_type == TYPE_BA)
	{
		addr1 = get_memory16(gStdRomDesc->sFilePtrBA);
	}
	else if ((file_type == TYPE_CO) || (file_type == TYPE_HEX))
	{
		addr1 = get_memory16(gStdRomDesc->sBeginVar);
	} 
	else if (file_type == TYPE_DO)
	{
		addr1 = get_memory16(gStdRomDesc->sFilePtrDO);
	}

	// Determine if file will fit in memory
	addr3 = get_memory16(gStdRomDesc->sBasicStrings);
	addr2 = get_memory16(gStdRomDesc->sBeginVar);
	if (addr3 - addr2 < len)
	{
		if (w != NULL)
			fl_message("%s", gTooLargeMsg);
		else
			gLoadError = 1;
		return;
	}

	// Determine Directory entry location for new file
	addr4 = gStdRomDesc->sDirectory + 11 * gStdRomDesc->sFirstDirEntry;
	dir_index = 0;
	while (get_memory8(addr4) != 0)
	{
		// Point to next directory entry
		addr4 += 11;
		if (++dir_index >= gStdRomDesc->sDirCount)
		{
			if (w != NULL)
				fl_message("Too many files in directory");
			else
				gLoadError = 1;
			return;
		}
	}

	// Move memory to make space for file
	move_len = get_memory16(gStdRomDesc->sUnusedMem) - addr1;
	for (x = move_len-1; x >= 0; x--)
		set_memory8(addr1+len+x, get_memory8(addr1+x)); 

	// Update existing Directory entry addresses
	update_file_offsets(addr1, len);

	// Add new Directory entry
	if (file_type == TYPE_HEX)
		set_memory8(addr4, TYPE_CO);
	else
		set_memory8(addr4, file_type);
	set_memory16(addr4+1, addr1);
	for (x = 0; x < 8; x++)
		set_memory8(addr4+3+x, mt_file[x]);

	// If a .BA file was added, renumber the address
	// pointers in any "unsaved" BASIC program that
	// may exist.
	if (file_type == TYPE_BA)
	{
		addr3 = get_memory16(gStdRomDesc->sFilePtrBA);

		while (get_memory16(addr3) != 0)
		{
			set_memory16(addr3, get_memory16(addr3)+len);
			addr3 = get_memory16(addr3);
		}
	}

	// Update Other pointers stored in memory
	addr3 = get_memory16(gStdRomDesc->sBeginArray);
	if (addr3 >= addr1)
		set_memory16(gStdRomDesc->sBeginArray, addr3 + len);

	if ((file_type != TYPE_CO) || (file_type == TYPE_HEX))
	{
		addr3 = get_memory16(gStdRomDesc->sBeginCO);
		if (addr3 > addr1)
			set_memory16(gStdRomDesc->sBeginCO, addr3 + len);
	}

	if (file_type == TYPE_BA)
	{
		/* Update beginning of .DO file pointer */
		addr3 = get_memory16(gStdRomDesc->sBeginDO);
		if (addr3 > addr1)
			set_memory16(gStdRomDesc->sBeginDO, addr3 + len);

		/* Update BASIC size variable */
		addr3 = get_memory16(gStdRomDesc->sBasicSize);
		set_memory16(gStdRomDesc->sBasicSize, addr3 + len-2);
	}

	addr3 = get_memory16(gStdRomDesc->sBeginVar);
	if (addr3 >= addr1)
		set_memory16(gStdRomDesc->sBeginVar, addr3 + len);

	addr3 = get_memory16(gStdRomDesc->sUnusedMem);
	if (addr3 >= addr1)
		set_memory16(gStdRomDesc->sUnusedMem, addr3 + len);

	// Copy the data to the Model T
	if (file_type == TYPE_DO)
	{
		for (x = 0; x < len; x++)
			set_memory8(addr1+x, conv[x]);
	}
	else if ((file_type == TYPE_CO) || (file_type == TYPE_HEX))
	{
		for (x = 0; x < len; x++)
			set_memory8(addr1+x, data[x]);
	}
	else if (file_type == TYPE_BA)
	{
		for (x = 0; x < len; x++)
			set_memory8(addr1+x, conv[x]);
	}

	// Update file view if open
	fileview_model_changed();

	// Reset the system so file will show up
	jump_to_zero();

}

int remote_load_from_host(const char *filename)
{
	gLoadError = 0;
	cb_LoadFromHost(NULL, (void *) filename);
	return gLoadError;
}
