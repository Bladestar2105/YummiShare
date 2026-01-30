from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to Home
        print("Navigating to home...")
        page.goto("http://localhost:8081")

        # 2. Click Recipes tab
        print("Clicking Recipes tab...")
        # Use role="tab" and name="Recipes"
        # The icon might interfere, so we use a substring match which is default
        page.get_by_role("tab", name="Recipes").click()

        # 3. Click FAB to create recipe
        print("Clicking Create Recipe FAB...")
        # Use accessibility label
        page.get_by_label("create-recipe-fab").click()

        # 4. Wait for Create Recipe screen
        print("Waiting for Create Recipe screen...")
        expect(page.get_by_text("Create a New Recipe")).to_be_visible()

        # 5. Scroll to Difficulty and select Hard
        print("Selecting Hard difficulty...")
        # Difficulty selection
        # We can find the button by accessibility label
        hard_button = page.get_by_label("Select Hard difficulty")
        hard_button.scroll_into_view_if_needed()
        hard_button.click()

        # 6. Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/difficulty_selection.png")

        browser.close()
        print("Done!")

if __name__ == "__main__":
    run()
