from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:8081")
            page.goto("http://localhost:8081", timeout=60000)

            # Wait for tab bar
            page.wait_for_selector("text=Rezepte", timeout=20000)

            # Click on "Rezepte"
            print("Clicking 'Rezepte' tab")
            page.get_by_text("Rezepte").click()

            # Wait for RecipesScreen content
            # It might show "No recipes yet." or loader.
            # Loader might be fast.
            page.wait_for_timeout(3000) # Wait a bit for transition

            # Take screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            output_path = "/home/jules/verification/recipes_screen_tab.png"
            page.screenshot(path=output_path)
            print(f"Screenshot taken at {output_path}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
