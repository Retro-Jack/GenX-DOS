"""Tidy the emulator's own control labels for player-facing pages.

The core's controls data is authoritative about WHICH button does WHAT, and that
is why it is used. Its labels are not consistently written, though: a handful
shout in capitals, two spell hyperspace three different ways between them, and
Tempest's Superzapper is split in two. This maps them to what the cabinet and
the manufacturer's own paperwork called them. Every correction is listed
explicitly rather than derived by rule, so a wrong one is visible here.
"""

# exact label -> what a player should read
CORRECTIONS = {
    'FIRE': 'Fire',
    'THRUST': 'Thrust',
    'REVERSE': 'Reverse',
    'SMART BOMB': 'Smart Bomb',
    'HYPER SPACE': 'Hyperspace',    # Asteroids
    'HYPERSPACE': 'Hyperspace',     # Defender, already one word
    'Hyper Space': 'Hyperspace',
    'Super Zapper': 'Superzapper',  # Tempest: Atari's own spelling
    'Kick ': 'Kick',                # stray trailing space
    'Hi': 'High',
    'Lo': 'Low',
    'Left Blow To Head/Body': 'Left blow to head / body',
    'Right Blow to Head/Body': 'Right blow to head / body',
    'Jump/Kick': 'Jump / Kick',
    'Jump/Throw': 'Jump / Throw',
    'Push to Fire': 'Push to fire',
    'Break': 'Brake',               # axis label on Paperboy
    'Fire - Center': 'Fire &mdash; Centre',   # British spelling, per the site
}

# labels that name no control and should not become a table row at all
DROP = {'', 'Not used', 'Unknown'}

def tidy(label):
    """Return the player-facing label, or None if the row should be dropped."""
    label = CORRECTIONS.get(label, label)
    if label in DROP:
        return None
    # 'Fire - Left' reads better with a dash than a hyphen
    return label.replace(' - ', ' &mdash; ')
