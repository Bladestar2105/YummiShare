from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8081")

    # Navigate to 'Rezepte' tab
    # Assuming the tab has text 'Rezepte' or a specific role
    # In React Native Web, tab bars often are links or buttons
    page.get_by_text("Rezepte").click()

    # Click the FAB '+' button
    # It might be an image or a button with aria-label.
    # The FAB icon is "plus". React Native Paper FAB usually renders a button.
    # We can try to find by role button with no name or check for 'plus' icon context.
    # Or maybe it has an accessibility label if defined? It doesn't seem to have one in the code I read.
    # But checking the code: <FAB style={styles.fab} icon="plus" onPress={handleCreateRecipe} />
    # Usually FAB renders a button.
    # Let's try to find the button at the bottom right or by role.
    # Since it is the only FAB, maybe page.get_by_role("button").last?

    # Wait for navigation
    page.wait_for_timeout(2000)

    # Try to find the FAB. Since it has no label, we might need to be creative.
    # If there are no recipes, there is text "Tap the '+' button..."

    # Let's try to click the last button on the page, or look for SVG/Icon.
    # For now, let's assume it's identifiable.
    # Actually, RNP FAB usually has an aria-label if specified, but here it is not.
    # Maybe we can find by class or just click the bottom right.

    # Actually, let's just use a loose selector for now as verification is manual inspection of screenshot mostly.
    # Or I can add accessibilityLabel to the FAB in RecipesScreen.tsx first? No, I should stick to scope.

    # Try to find a button with icon "plus" - RNP uses font icons.
    # Let's try click the last button.
    buttons = page.locator("button").all()
    if buttons:
        buttons[-1].click()
    else:
        # Maybe it's a link?
        pass

    # Wait for Create Recipe screen
    page.wait_for_timeout(2000)

    # Check for "Make Recipe Public" text
    expect(page.get_by_text("Make Recipe Public")).to_be_visible()

    # Check for the Switch
    # It should have the accessibility label I added.
    # React Native Web maps accessibilityLabel to aria-label.
    switch_el = page.get_by_label("Make Recipe Public")
    expect(switch_el).to_be_visible()

    # Take screenshot
    page.screenshot(path="verification/visibility_toggle.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
