
from playwright.sync_api import Page, expect, sync_playwright

def verify_recipes_screen(page: Page):
    print("Navigating to app...")
    page.goto("http://localhost:8081")

    # Wait for the app to render content
    print("Waiting for body...")
    page.wait_for_selector("body")

    # Click on "Rezepte" tab
    print("Looking for 'Rezepte' tab...")
    # React Native Web might render text inside a View.
    # We can try to finding text "Rezepte"
    rezepte_tab = page.get_by_text("Rezepte")
    rezepte_tab.click()

    print("Clicked Rezepte tab. Waiting for Recipes screen content...")
    # Expect "Meine Rezepte" header or "No recipes yet" content.
    # The header title is "Meine Rezepte".
    expect(page.get_by_text("Meine Rezepte")).to_be_visible(timeout=10000)

    # Check if we see the empty state or a recipe
    # Empty state: "No recipes yet."
    # Recipe: We check if any element looks like a card content if we had data,
    # but likely it's empty.

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/recipes_screen.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_recipes_screen(page)
        finally:
            browser.close()
