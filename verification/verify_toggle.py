from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to app...")
    page.goto("http://localhost:8081")
    page.wait_for_timeout(5000) # Wait for Expo to load bundle

    page.screenshot(path="verification/landing.png")
    print("Landing page screenshot taken.")

    # Try to find 'Rezepte' tab
    rezepte_tab = page.get_by_text("Rezepte")
    if rezepte_tab.count() > 0:
        print("Found Rezepte tab, clicking...")
        rezepte_tab.click()
        page.wait_for_timeout(1000)
    else:
        print("Rezepte tab not found, attempting to proceed.")

    # Find FAB. It should be a button. We assume it's the floating one.
    # We can try to match by some attribute if we knew it.
    # Let's try to click the button that looks like a FAB (usually last button).
    buttons = page.get_by_role("button").all()
    if buttons:
        print(f"Found {len(buttons)} buttons. Clicking the last one (assuming FAB)...")
        buttons[-1].click()
        page.wait_for_timeout(2000)
    else:
        print("No buttons found!")
        browser.close()
        return

    page.screenshot(path="verification/create_screen.png")
    print("Create screen screenshot taken.")

    # Verify "Make Recipe Public" label exists
    label = page.get_by_text("Make Recipe Public")
    if label.count() == 0:
        print("Label 'Make Recipe Public' not found.")
        browser.close()
        return

    print("Found 'Make Recipe Public' label.")

    # Find the switch
    switch_el = page.get_by_role("switch").first
    if switch_el.count() == 0:
        # Fallback for checkbox
        switch_el = page.locator('input[type="checkbox"]').first

    if switch_el.count() == 0:
        print("Switch element not found.")
        browser.close()
        return

    # Check initial state
    initial_checked = switch_el.is_checked() if switch_el.get_attribute("type") == "checkbox" else switch_el.get_attribute("aria-checked") == "true"
    print(f"Initial switch state: {initial_checked}")

    # Click the LABEL to toggle
    print("Clicking the label...")
    label.click()
    page.wait_for_timeout(1000)

    # Check new state
    new_checked = switch_el.is_checked() if switch_el.get_attribute("type") == "checkbox" else switch_el.get_attribute("aria-checked") == "true"
    print(f"New switch state: {new_checked}")

    if new_checked != initial_checked:
        print("SUCCESS: Switch state changed.")
    else:
        print("FAILURE: Switch state did NOT change.")

    page.screenshot(path="verification/final_state.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
