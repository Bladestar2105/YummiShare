import subprocess
import time
from playwright.sync_api import sync_playwright

def verify_screenshots():
    # Start Expo web server in background
    print("Starting Expo web server...")
    # Use setsid or similar if needed, but Popen defaults should be okay for simple cleanup
    expo_process = subprocess.Popen(
        ["npx", "expo", "start", "--web"],
        stdout=subprocess.DEVNULL, # Mute stdout to clean up output
        stderr=subprocess.DEVNULL,
    )

    # Give it some time to start
    print("Waiting for server to start (30s)...")
    time.sleep(30)

    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)

            # Context for Android (Pixel 5)
            # Pixel 5 viewport: 393 x 851
            context_android = browser.new_context(
                viewport={'width': 393, 'height': 851},
                user_agent='Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
                is_mobile=True,
                has_touch=True
            )
            page_android = context_android.new_page()

            # Context for iOS (iPhone 12)
            # iPhone 12 viewport: 390 x 844
            context_ios = browser.new_context(
                viewport={'width': 390, 'height': 844},
                user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
                is_mobile=True,
                has_touch=True
            )
            page_ios = context_ios.new_page()

            url = "http://localhost:8081"

            print(f"Navigating to {url} (Android context)...")
            try:
                page_android.goto(url, timeout=60000)
                # Wait for something to load. The title "Daily Suggestions" is what we added.
                # However, initial load might take time.
                page_android.get_by_text("Daily Suggestions").wait_for(timeout=60000)
                # Let it render fully
                time.sleep(2)
                page_android.screenshot(path="verification/android_simulation.png")
                print("Android screenshot taken.")
            except Exception as e:
                print(f"Android verification failed: {e}")
                page_android.screenshot(path="verification/android_error.png")

            print(f"Navigating to {url} (iOS context)...")
            try:
                page_ios.goto(url, timeout=60000)
                page_ios.get_by_text("Daily Suggestions").wait_for(timeout=60000)
                time.sleep(2)
                page_ios.screenshot(path="verification/ios_simulation.png")
                print("iOS screenshot taken.")
            except Exception as e:
                print(f"iOS verification failed: {e}")
                page_ios.screenshot(path="verification/ios_error.png")

            browser.close()

    finally:
        print("Stopping Expo web server...")
        expo_process.terminate()
        expo_process.wait()

if __name__ == "__main__":
    verify_screenshots()
