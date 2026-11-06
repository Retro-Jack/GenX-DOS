<?php
/**
 * GenX-DOS — contact form.
 *
 * The one server-side thing on the site. Everything else is static files, so
 * this page is deliberately self-contained: no framework, no database, no
 * session, and no third-party anti-spam. A captcha would mean a script from
 * somewhere else, and the site makes no external calls at runtime.
 *
 * What stands in for a captcha is three cheap checks that between them stop
 * effectively all automated submissions: a signed token that must be minted
 * by this page, a honeypot field a human never sees, and a minimum fill time.
 * On top of that a per-sender rate limit, which is the only thing kept
 * between requests -- and it is kept as a keyed hash, never an address.
 *
 * The secret and the rate-limit store live OUTSIDE the web root. With no
 * secret the form refuses to render rather than falling back to something
 * weaker, so a half-finished deployment cannot quietly become an open relay.
 */
declare(strict_types=1);

const MAIL_TO     = 'admin@genx-dos.fun';
const MAIL_FROM   = 'no-reply@genx-dos.fun';
const TOKEN_MAX   = 7200;   // a form left open for two hours still posts
const TOKEN_MIN   = 4;      // nobody fills this in in under four seconds
const RATE_MAX    = 4;      // submissions per sender...
const RATE_WINDOW = 3600;   // ...per hour
const MSG_MAX     = 4000;

// ---- where the secrets live ------------------------------------------------
$root  = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$store = dirname($root) . '/.genx-contact';
$secret = is_readable("$store/secret") ? trim((string)file_get_contents("$store/secret")) : '';

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** One line of a mail header, encoded if it is not plain ASCII. */
function hdr(string $s): string {
    return preg_match('/^[\x20-\x7E]*$/', $s) ? $s : '=?UTF-8?B?' . base64_encode($s) . '?=';
}

/** A sender is a keyed hash of the address, so nothing identifiable is stored. */
function sender_key(string $secret): string {
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    return substr(hash_hmac('sha256', $ip, $secret), 0, 32);
}

function token_make(string $secret, string $who): string {
    $ts = time();
    return $ts . '.' . hash_hmac('sha256', "$ts|$who", $secret);
}

function token_ok(string $secret, string $who, string $tok, ?string &$why): bool {
    $parts = explode('.', $tok, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) { $why = 'malformed'; return false; }
    $age = time() - (int)$parts[0];
    if ($age < TOKEN_MIN) { $why = 'too fast';  return false; }
    if ($age > TOKEN_MAX) { $why = 'expired';   return false; }
    $want = hash_hmac('sha256', $parts[0] . '|' . $who, $secret);
    if (!hash_equals($want, $parts[1])) { $why = 'bad signature'; return false; }
    return true;
}

/** File-backed sliding window. Returns false when the sender is over the cap. */
function rate_ok(string $dir, string $who): bool {
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return true;  // never block on a broken store
    $f = "$dir/$who";
    $now = time();
    $hits = is_readable($f) ? array_filter(array_map('intval', explode(',', (string)file_get_contents($f)))) : [];
    $hits = array_values(array_filter($hits, fn($t) => $t > $now - RATE_WINDOW));
    if (count($hits) >= RATE_MAX) return false;
    $hits[] = $now;
    @file_put_contents($f, implode(',', $hits), LOCK_EX);
    if (random_int(1, 50) === 1) {                       // occasional sweep
        foreach (glob("$dir/*") ?: [] as $old) {
            if (is_file($old) && filemtime($old) < $now - RATE_WINDOW) @unlink($old);
        }
    }
    return true;
}

// ---- state -----------------------------------------------------------------
$errors = [];
$sent   = isset($_GET['sent']);
$values = ['name' => '', 'email' => '', 'subject' => '', 'message' => ''];

if ($secret === '') {
    $errors[] = 'The form is not configured on this server. Please try again later.';
} elseif (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $who = sender_key($secret);

    // Same-origin: a cross-site post has an Origin we did not serve.
    $host   = (string)($_SERVER['HTTP_HOST'] ?? '');
    $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
        $errors[] = 'That submission did not come from this page.';
    }

    $why = null;
    if (!$errors && !token_ok($secret, $who, (string)($_POST['t'] ?? ''), $why)) {
        $errors[] = $why === 'too fast'
            ? 'That was submitted a little too quickly. Please try again.'
            : 'This form has been open too long. Please send it again.';
    }

    // The honeypot: styled off-screen, so only something reading the HTML fills it.
    if (!$errors && trim((string)($_POST['website'] ?? '')) !== '') {
        $errors[] = 'Sorry, that looked automated.';
    }

    foreach ($values as $k => $_) { $values[$k] = trim((string)($_POST[$k] ?? '')); }

    // CR and LF in a header field is how mail injection works. Refuse outright.
    foreach (['name', 'email', 'subject'] as $k) {
        if (preg_match('/[\r\n]/', $values[$k])) { $errors[] = 'That contains characters we cannot send.'; break; }
    }

    if (!$errors) {
        if ($values['name'] === '' || mb_strlen($values['name']) > 80)       $errors[] = 'Please give a name, up to 80 characters.';
        if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL) || strlen($values['email']) > 254)
                                                                             $errors[] = 'Please give an email address we can reply to.';
        if ($values['subject'] === '' || mb_strlen($values['subject']) > 120) $errors[] = 'Please give a subject, up to 120 characters.';
        $len = mb_strlen($values['message']);
        if ($len < 10 || $len > MSG_MAX)                                     $errors[] = 'Please write between 10 and ' . MSG_MAX . ' characters.';
    }

    // Last, so that only a message that would otherwise be sent counts against
    // the sender. Checked earlier it punished typos: three goes at an email
    // address and a real person had spent most of their hour's allowance on
    // messages that never left the building. The cheap rejections above still
    // come first, so nothing automated reaches this at all.
    if (!$errors && !rate_ok("$store/rate", $who)) {
        $errors[] = 'That is several messages in a short time. Please try again later.';
    }

    if (!$errors) {
        // Jack's local time, and the abbreviation comes from the zone rather
        // than being written in, so it reads NZDT now and NZST over winter
        // without anyone having to remember to change it.
        $when = new DateTimeImmutable('now', new DateTimeZone('Pacific/Auckland'));

        $body = "From:    {$values['name']} <{$values['email']}>\n"
              . "Subject: {$values['subject']}\n"
              . 'Sent:    ' . $when->format('d/m/Y H:i:s T') . "\n"
              . "Sender:  " . substr($who, 0, 12) . "  (keyed hash, not an address)\n"
              . str_repeat('-', 68) . "\n\n"
              . $values['message'] . "\n";

        $headers = implode("\r\n", [
            'From: GenX-DOS <' . MAIL_FROM . '>',
            'Reply-To: ' . hdr($values['name']) . ' <' . $values['email'] . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ]);

        $ok = @mail(MAIL_TO, hdr('[GenX-DOS] ' . $values['subject']), $body, $headers, '-f' . MAIL_FROM);
        if ($ok) { header('Location: ?sent=1', true, 303); exit; }
        $errors[] = 'The message could not be sent just now. Please try again shortly.';
    }
}

$token = $secret === '' ? '' : token_make($secret, sender_key($secret));
?>
<!doctype html>
<html lang="en">
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; base-uri 'none'; form-action 'self'">
  <meta charset="utf-8">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="icon" type="image/gif" href="/prompt/animated_favicon1.gif">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Contact — GenX-DOS</title>
  <link rel="stylesheet" href="/styles/contact.css">
</head>
<body>
  <a class="gx-home" href="/">&#8617;&nbsp;<b>GenX&#8209;DOS</b></a>
  <div class="wrap">
    <div class="head">
      <div class="system">GenX-DOS</div>
      <h1>Contact</h1>
    </div>

<?php if ($sent): ?>
    <p class="intro">Thank you — that has been sent.</p>
    <p>If it needs a reply you will get one at the address you gave. There is
       no account, no list and nothing stored: the message goes straight to an
       inbox and nowhere else.</p>
    <p class="ways"><a class="way primary" href="/">Back to the home page</a>
       <a class="way" href="/contact/">Send another</a></p>
<?php else: ?>
    <p class="intro">Questions, bug reports, requests for a machine or a game —
       or anything else about the site.</p>
    <p>Please say which machine and which game if it is about something not
       working, and which browser you were using. That usually saves a round
       trip.</p>

<?php if ($errors): ?>
    <div class="problem" role="alert">
      <p><strong>That did not send:</strong></p>
      <ul><?php foreach ($errors as $e): ?><li><?= h($e) ?></li><?php endforeach; ?></ul>
    </div>
<?php endif; ?>

    <form method="post" action="/contact/" class="gx-form">
      <input type="hidden" name="t" value="<?= h($token) ?>">
      <p class="pot"><label>Website<input type="text" name="website" value="" tabindex="-1" autocomplete="off"></label></p>

      <label for="name">Your name</label>
      <input id="name" name="name" type="text" maxlength="80" required autocomplete="name" value="<?= h($values['name']) ?>">

      <label for="email">Email</label>
      <input id="email" name="email" type="email" maxlength="254" required autocomplete="email" value="<?= h($values['email']) ?>">
      <p class="hint">Only used to reply. It is not stored or passed on.</p>

      <label for="subject">Subject</label>
      <input id="subject" name="subject" type="text" maxlength="120" required value="<?= h($values['subject']) ?>">

      <label for="message">Message</label>
      <textarea id="message" name="message" rows="10" maxlength="<?= MSG_MAX ?>" required><?= h($values['message']) ?></textarea>

      <button type="submit">Send</button>
    </form>
<?php endif; ?>

    <p class="note">This is the only part of GenX-DOS with anything running on
      the server. It keeps no logs of its own, sets no cookies and loads no
      scripts — your message is emailed and that is the end of it.</p>
  </div>
</body>
</html>
