import json
import logging

from sqlmodel import Session, select
from telegram import KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo, InlineKeyboardMarkup, \
    InlineKeyboardButton
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

from app.api.deps import get_db
from app.core.config import settings
from app.core.db import engine
from app.models import User

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


# Define a `/start` command handler.
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button that opens the web app."""
    referee_telegram_id = None
    try:
        referee_telegram_id = int(update.message.text.replace("/start ", "")) or None
    except ValueError:
        pass
    telegram_id = str(update.message.from_user.id)
    try:
        with Session(engine) as session:
            user = session.exec(select(User).where(User.telegram_id == telegram_id)).first()
            if not user:
                referee_user = session.exec(select(User).where(User.telegram_id == str(referee_telegram_id))).first() if referee_telegram_id else None
                referee_id = None
                if referee_user:
                    referee_id = referee_user.id
                user = User(
                    telegram_id=str(update.message.from_user.id),
                    email="",
                    full_name=update.message.from_user.full_name,
                    coins=0,
                    hashed_password="",
                    referee_id=referee_id
                )
                session.add(user)
                session.commit()
            else:
                print("Check", referee_telegram_id)
    except Exception as e:
        print(e)

    await update.message.reply_text(
        "Please press the button below.",
        reply_markup=InlineKeyboardMarkup.from_button(
            InlineKeyboardButton(
                text="Open the TONXDAO!",
                web_app=WebAppInfo(url=f"https://{settings.DOMAIN}/"),
            )
        ),
    )


# Handle incoming WebAppData
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Print the received data and remove the button."""
    # Here we use `json.loads`, since the WebApp sends the data JSON serialized string
    # (see webappbot.html)
    # data = json.loads(update.effective_message.web_app_data.data)
    # await update.message.reply_html(
    #     text=(
    #         f"You selected the color with the HEX value <code>{data['hex']}</code>. The "
    #         f"corresponding RGB value is <code>{tuple(data['rgb'].values())}</code>."
    #     ),
    #     reply_markup=ReplyKeyboardRemove(),
    # )


def main() -> None:
    application = Application.builder().token(settings.APP_TELEGRAM_BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))

    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
