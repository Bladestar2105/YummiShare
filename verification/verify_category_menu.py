from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:8081")

        # Wait for initial load
        page.wait_for_timeout(3000)

        # Go to Recipes tab
        # Try to find text "Recipes" which acts as tab
        page.get_by_text("Recipes", exact=True).click()

        page.wait_for_timeout(1000)

        # Click FAB
        # If accessing by label doesn't work, try testID or role
        # Memory says "create-recipe-fab" label.
        page.get_by_label("create-recipe-fab").click()

        # Wait for Create Recipe Screen
        expect(page.get_by_text("Create a New Recipe")).to_be_visible()

        # Click Category input
        page.get_by_label("Category").click()

        # Wait for menu to appear
        # Verify a specific item
        dessert_item = page.get_by_test_id("category-item-dessert")
        expect(dessert_item).to_be_visible()

        # Wait for animation
        page.wait_for_timeout(1000)

        # Screenshot
        page.screenshot(path="verification/category_menu.png")
        print("Screenshot saved to verification/category_menu.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
