from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.common.exceptions import NoSuchElementException
import time
import subprocess


def setup_driver():
    options = UiAutomator2Options()
    options.set_capability("platformName", "Android")
    options.set_capability("deviceName", "emulator-5554")
    options.set_capability("app", r"C:\Desktop\application-403829f8-7bd9-4c96-8a95-ad86339e8994.apk")
    options.set_capability("autoGrantPermissions", True)
    driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
    driver.implicitly_wait(10)
    return driver


def toggle_airplane_mode(enable: bool):
    """Toggle airplane mode ON/OFF using adb."""
    state = "1" if enable else "0"
    subprocess.run(["adb", "shell", "settings", "put", "global", "airplane_mode_on", state])
    subprocess.run(["adb", "shell", "am", "broadcast", "-a", "android.intent.action.AIRPLANE_MODE", "--ez", "state", state])
    time.sleep(2)  # give time for network state to change


# valid Login
def test_valid_login():
    print("[VALID LOGIN] Starting test...")
    driver = setup_driver()
    try:
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "email-input").send_keys("test@example.com")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "password-input").send_keys("1")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login-button").click()
        time.sleep(2)
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input")
        print("✅ Valid login successful, survey screen reached.")
    except Exception as e:
        print("❌ Valid login test failed:", e)
    finally:
        driver.quit()


# invalid Login
def test_invalid_login():
    print("[INVALID LOGIN] Starting test...")
    driver = setup_driver()
    try:
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "email-input").send_keys("wrong@example.com")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "password-input").send_keys("wrongpass")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login-button").click()
        time.sleep(2)
        popup = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "popup-message")
        if "Invalid" in popup.text:
            print("✅ Invalid login correctly showed error popup.")
        else:
            print("❌ Unexpected popup content:", popup.text)
    except NoSuchElementException:
        print("❌ Popup not found — error not handled properly?")
    finally:
        driver.quit()


# empty fields
def test_empty_login():
    print("[EMPTY FIELDS] Starting test...")
    driver = setup_driver()
    try:
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login-button").click()
        time.sleep(2)
        popup = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "popup-message")
        if "Invalid" in popup.text:
            print("✅ Empty fields correctly triggered error popup.")
        else:
            print("❌ Unexpected popup content:", popup.text)
    except NoSuchElementException:
        print("❌ Popup not found — empty fields may not be handled?")
    finally:
        driver.quit()


# internet disconnect test
def test_internet_disconnect():
    print("[NETWORK DROP] Starting test...")
    driver = setup_driver()
    try:
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "email-input").send_keys("test@example.com")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "password-input").send_keys("1")

        # simulate network drop
        toggle_airplane_mode(True)

        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login-button").click()
        time.sleep(3)

        try:
            popup = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "popup-message")
            print("✅ Network error popup appeared:", popup.text)
        except NoSuchElementException:
            print("❌ No popup shown after disconnect. App may not handle network loss.")

    except Exception as e:
        print("❌ Network drop test failed:", e)
    finally:
        toggle_airplane_mode(False)
        driver.quit()


# run all
if __name__ == "__main__":
    test_valid_login()
    test_invalid_login()
    test_empty_login()
    test_internet_disconnect()
