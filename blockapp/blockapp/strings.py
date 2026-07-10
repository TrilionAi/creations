"""All user-facing text lives here so the app can be localized in one place.

To ship a Portuguese build, translate the values below — no other file needs
to change.
"""
from __future__ import annotations

APP_TAGLINE = "Block distractions. Build discipline."

# Onboarding / password
SET_PASSWORD_TITLE = "Create your master password"
SET_PASSWORD_BODY = (
    "This password is required to change or remove a block later.\n"
    "Choose one you will remember — there is no reset."
)
PASSWORD_MISMATCH = "The passwords do not match."
PASSWORD_TOO_SHORT = "Use at least 4 characters."
ENTER_PASSWORD_TITLE = "Enter your master password"
WRONG_PASSWORD = "Wrong password."
LOCKED_OUT = (
    "Too many wrong attempts. For your own discipline, changes are frozen "
    "until {when}."
)

# Confirmation flow when creating a block
CONFIRM_TITLE = "Confirm this block"
CONFIRM_STEP = "Confirmation {n} of {total}"
CONFIRM_NORMAL_BODY = (
    "You are about to block:\n\n    {target}\n\n{duration}\n\n"
    "Once confirmed, it cannot be undone until tomorrow. Continue?"
)
CONFIRM_STRONG_WARNING = (
    "This is a LONG block ({hours} hours).\n\n"
    "You will NOT be able to unlock it early today, no matter what. "
    "Make sure this is really what you want."
)
CONFIRM_FINAL_BODY = (
    "Final confirmation.\n\n"
    "After this, {target} is locked. You cannot remove it today — only "
    "tomorrow, and only after answering three questions.\n\n"
    "Lock it in?"
)
CONFIRM_YES = "Yes, lock it in"
CONFIRM_NO = "Cancel"

# Same-day lock
CANNOT_CHANGE_TODAY = (
    "This block was locked in today. You can only change it tomorrow.\n\n"
    "That is the whole point — give your future self the discipline your "
    "present self is asking for."
)

# Unlock challenge (motivational gate)
UNLOCK_TITLE = "Are you sure you want to unblock?"
UNLOCK_STEP = "Question {n} of {total}"
UNLOCK_KEEP = "Keep it blocked"
UNLOCK_PROCEED = "I still want to unblock"

# Shown one per unlock step, in order.
MOTIVATIONAL = [
    "Discipline is choosing what you want most over what you want now.",
    "The urge you feel will pass whether you give in or not. Let it pass.",
    "You set this block for a reason. That reason still matters.",
    "Every time you resist, the habit gets a little weaker.",
    "Future you is watching. Make them proud.",
    "You are not missing out — you are focusing in.",
]

# Rule list / main window
MAIN_TITLE = "BlockApp"
ADD_BLOCK = "Add block"
NO_RULES = "No active blocks yet. Add one to get started."
COL_TARGET = "Target"
COL_TYPE = "Type"
COL_WHEN = "When"
COL_STATUS = "Status"
STATUS_ACTIVE = "Blocking now"
STATUS_SCHEDULED = "Scheduled"
STATUS_EXPIRED = "Expired"
REMOVE_BLOCK = "Remove"

# Add-block dialog
CHOOSE_TYPE = "What do you want to block?"
TYPE_APP = "An application"
TYPE_WEBSITE = "A website"
TYPE_FOLDER = "A folder (advanced)"
CHOOSE_MODE = "How long?"
MODE_FOR = "For a set duration"
MODE_SCHEDULE = "On a recurring schedule"
TARGET_APP_HINT = "Executable name, e.g. chrome.exe or steam.exe"
TARGET_WEBSITE_HINT = "Domain, e.g. instagram.com"
TARGET_FOLDER_HINT = "Full path to the folder"

# Safety refusals
REFUSE_PROTECTED_APP = "That application is protected and cannot be blocked."
REFUSE_PROTECTED_PATH = "That folder is a system location and cannot be blocked."
REFUSE_EMPTY = "Please enter what you want to block."


def duration_summary(hours: float) -> str:
    """Human-readable duration for confirmation dialogs."""
    if hours < 1:
        return f"for {int(round(hours * 60))} minutes"
    if hours < 48:
        return f"for {hours:.0f} hours"
    days = hours / 24
    if days < 60:
        return f"for {days:.0f} days"
    return f"for {days / 30:.0f} months"
