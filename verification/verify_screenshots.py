import subprocess
import time
import os
import re
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = "assets/screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def verify_screenshots():
    # Start Expo web server in background
    print("Starting Expo web server...")
    expo_process = subprocess.Popen(
        ["npx", "expo", "start", "--web"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    print("Waiting for server to start (30s)...")
    time.sleep(30)

    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)

            contexts = [
                {
                    "name": "android",
                    "viewport": {'width': 393, 'height': 851},
                    "user_agent": 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
                },
                {
                    "name": "ios",
                    "viewport": {'width': 390, 'height': 844},
                    "user_agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
                }
            ]

            url = "http://localhost:8081"

            for ctx_config in contexts:
                name = ctx_config["name"]
                print(f"Processing {name} context...")

                context = browser.new_context(
                    viewport=ctx_config["viewport"],
                    user_agent=ctx_config["user_agent"],
                    is_mobile=True,
                    has_touch=True
                )
                page = context.new_page()

                try:
                    # 1. Seed Data
                    print(f"[{name}] Seeding Data...")
                    page.goto(url, timeout=60000)
                    page.wait_for_load_state("networkidle")

                    # Navigate to Profile (Now English: "Profile")
                    page.get_by_text("Profile", exact=True).click()

                    # Click Load Demo Data
                    page.get_by_text("Load Demo Data").click()
                    time.sleep(2)

                    # 2. Capture Profile
                    print(f"[{name}] Capturing Profile...")
                    page.screenshot(path=f"{SCREENSHOT_DIR}/profile_{name}.png")

                    # 3. Capture Home (Suggestions)
                    print(f"[{name}] Capturing Home...")
                    page.get_by_text("Home", exact=True).click()
                    page.get_by_text("Daily Suggestions").wait_for()
                    page.get_by_text("Get New Suggestions").wait_for()
                    time.sleep(1)
                    page.screenshot(path=f"{SCREENSHOT_DIR}/home_{name}.png")

                    # 4. Recipes List
                    print(f"[{name}] Capturing List...")
                    # Navigate to Recipes tab (Now "Recipes")
                    # Use strict regex to match "Recipes"
                    page.get_by_role("tab", name=re.compile("Recipes", re.IGNORECASE)).click()
                    # Wait for seeding to reflect
                    page.get_by_text("Spaghetti Carbonara").first.wait_for()
                    time.sleep(1)
                    page.screenshot(path=f"{SCREENSHOT_DIR}/list_{name}.png")

                    # 5. Recipe Detail
                    print(f"[{name}] Capturing Detail...")
                    # Force click Carbonara
                    page.get_by_text("Spaghetti Carbonara").first.click(force=True)
                    # Wait for Ingredients
                    page.get_by_text("Ingredients").wait_for()
                    time.sleep(1)
                    page.screenshot(path=f"{SCREENSHOT_DIR}/detail_{name}.png")

                    # Go back to List
                    page.get_by_role("tab", name=re.compile("Recipes", re.IGNORECASE)).click()

                    # 6. Create Recipe Screen
                    print(f"[{name}] Capturing Create...")
                    page.get_by_label("create-recipe-fab").click()
                    # Wait for "Create a New Recipe" title
                    page.get_by_text("Create a New Recipe").wait_for()
                    time.sleep(1)
                    page.screenshot(path=f"{SCREENSHOT_DIR}/create_{name}.png")

                    # 7. Search Screen
                    print(f"[{name}] Capturing Search...")
                    # "Search" tab
                    page.get_by_text("Search", exact=True).click()
                    # Placeholder text might still be "Rezeptname..." if I didn't update SearchScreen.tsx
                    # I should check SearchScreen.tsx, but usually it's "Search..."
                    # Let's assume I need to update SearchScreen.tsx to English too?
                    # I only updated AppNavigator and categories.ts.
                    # SearchScreen content might be German.
                    # I'll check SearchScreen.tsx content or just click and capture.
                    time.sleep(1)
                    page.screenshot(path=f"{SCREENSHOT_DIR}/search_{name}.png")

                except Exception as e:
                    print(f"[{name}] Failed during capture flow: {e}")
                    page.screenshot(path=f"{SCREENSHOT_DIR}/error_{name}.png")

                context.close()

            browser.close()

    finally:
        print("Stopping Expo web server...")
        expo_process.terminate()
        expo_process.wait()

if __name__ == "__main__":
    verify_screenshots()
