from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.common.exceptions import NoSuchElementException
import time
from selenium.webdriver import ActionChains
from selenium.webdriver.common.actions.pointer_input import PointerInput
from selenium.webdriver.common.actions import interaction
import subprocess


def setup_driver():
    options = UiAutomator2Options()
    options.set_capability("platformName", "Android")
    options.set_capability("deviceName", "emulator-5554")
    options.set_capability("app", r"C:\Desktop\application-376c5aca-3bce-4f57-a1c8-6c85b606dceb.apk")
    options.set_capability("autoGrantPermissions", True)
    driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
    driver.implicitly_wait(10)
    return driver


def login_and_go_to_survey(driver):
    driver.find_element(AppiumBy.ACCESSIBILITY_ID, "email-input").send_keys("test@example.com")
    driver.find_element(AppiumBy.ACCESSIBILITY_ID, "password-input").send_keys("1")
    driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login-button").click()
    time.sleep(2)
    driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input")

def toggle_airplane_mode(enable: bool):
    """Toggle airplane mode ON/OFF using adb."""
    state = "1" if enable else "0"
    subprocess.run(["adb", "shell", "settings", "put", "global", "airplane_mode_on", state])
    subprocess.run(["adb", "shell", "am", "broadcast", "-a", "android.intent.action.AIRPLANE_MODE", "--ez", "state", state])
    print(f"📱 Airplane mode {'enabled' if enable else 'disabled'}")
    time.sleep(2)

def test_network_failure_during_submission():
    print("[SURVEY] Testing network failure during submission...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)

        # fill in all required fields like in test_all_fields_and_submit
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input").send_keys("Network")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "surname-input").send_keys("Test")

        # birthdate Picker
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "birthdate-picker").click()
        time.sleep(1)
        try:
            ok_button = driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("OK")')
            ok_button.click()
        except:
            driver.tap([(500, 1000)])
        time.sleep(1)

        # Education Picker
        driver.find_element(AppiumBy.XPATH, "//android.widget.Spinner[1]").click()
        time.sleep(1)
        driver.tap([(200, 1200)])
        time.sleep(1)

        # City
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "city-input").send_keys("Offline City")

        # Gender picker
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().className("android.widget.Spinner").instance(1)').click()
        time.sleep(1)
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().text("Female")').click()
        time.sleep(1)

        # AI Models
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "checkbox-ChatGPT").click()
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "defect-ChatGPT").send_keys("Network connectivity issues")

        # Usecase Input
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "usecase-input").send_keys("Testing network resilience")

        # Enable airplane mode to simulate network failure
        print("Simulating network failure by enabling airplane mode...")
        toggle_airplane_mode(True)
        time.sleep(1)

        # Submit Survey
        send_buttons = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, "send-button")
        if send_buttons:
            send_buttons[0].click()
            print("Attempted to submit survey without network...")
            time.sleep(3)  # Wait for error handling
            
            # Check for error popup or message
            try:
                error_popup = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "popup-message")
                print(f"✅ Network error properly handled: {error_popup.text}")
            except NoSuchElementException:
                try:
                    error_toast = driver.find_element(AppiumBy.XPATH, "//android.widget.Toast")
                    print(f"✅ Network error toast displayed: {error_toast.get_attribute('text')}")
                except NoSuchElementException:
                    print("❌ No error message detected - app may not handle network failures properly")
        else:
            print("❌ Send button not found - form validation issue")

    except Exception as e:
        print(f"❌ Network failure test failed: {e}")

    finally:
        # restore network connectivity
        print("Restoring network connectivity...")
        toggle_airplane_mode(False)
        driver.quit()

def test_all_fields_and_submit():
    print("[SURVEY] Starting full form test with valid data...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)

        # Name and Surname
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input").send_keys("Alice")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "surname-input").send_keys("Smith")

        # Birthdate Picker
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "birthdate-picker").click()
        #time.sleep(1)
        try:
            ok_button = driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("OK")')
            ok_button.click()
        except:
            actions = ActionChains(driver)
            touch_input = PointerInput(interaction.POINTER_TOUCH, "touch")
            actions.w3c_actions.add_pointer_input(touch_input)
            actions.w3c_actions.pointer_action.move_to_location(500, 1000)
            actions.w3c_actions.pointer_action.pointer_down()
            actions.w3c_actions.pointer_action.pointer_up()
            actions.perform()
        #time.sleep(1)

        # Education Picker (use XPath)
        driver.find_element(AppiumBy.XPATH, "//android.widget.Spinner[1]").click()
        #time.sleep(1)
        driver.tap([(200, 1200)])
        #time.sleep(1)

        # City
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "city-input").send_keys("New York")

        # Gender picker
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().className("android.widget.Spinner").instance(1)').click()
        #time.sleep(1)
        # Select Female option using text
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().text("Female")').click()
        #time.sleep(1)

        # AI Models Checkbox
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "checkbox-ChatGPT").click()
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "defect-ChatGPT").send_keys("Sometimes inaccurate")

        # Usecase Input
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "usecase-input").send_keys("I use AI to write summaries.")

        # Submit Survey
        time.sleep(2)
        send_buttons = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, "send-button")
        if send_buttons:
            send_buttons[0].click()
            print("✅ Survey submission triggered (check email for confirmation).")
        else:
            print("❌ Send button still not found — check form validation logic.")

    except Exception as e:
        print("❌ Survey form test failed:", e)

    finally:
        driver.quit()

def test_missing_required_fields():
    print("[SURVEY] Starting test with missing fields...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)
        print("Attempting to submit empty survey...")
        time.sleep(1)
        send_btn = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, "send-button")
        if send_btn:
            print("❌ Form allowed submission despite being incomplete.")
        else:
            print("✅ Send button not visible when form is incomplete — validation working.")

    except Exception as e:
        print("❌ Validation test failed:", e)

    finally:
        driver.quit()


def test_toggle_multiple_checkboxes():
    print("[SURVEY] Testing multiple AI model selection...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)

        # Fill in basic information
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input").send_keys("Bob")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "surname-input").send_keys("Johnson")

        # Select birthdate and education
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "birthdate-picker").click()
        time.sleep(1)
        driver.tap([(500, 1000)])
        time.sleep(1)
        
        # Education picker
        driver.find_element(AppiumBy.XPATH, "//android.widget.Spinner[1]").click()
        time.sleep(1)
        driver.tap([(200, 1200)])
        time.sleep(1)
        
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "city-input").send_keys("London")
        
        # Gender picker 
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().className("android.widget.Spinner").instance(1)').click()
        time.sleep(1)
        # Select Female option
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                           'new UiSelector().text("Female")').click()
        time.sleep(1)

        # Multiple checkbox selections for AI models
        models = ["ChatGPT", "Gemini", "Claude", "Deepseek"]
        for model in models:
            driver.find_element(AppiumBy.ACCESSIBILITY_ID, f"checkbox-{model}").click()
            driver.find_element(AppiumBy.ACCESSIBILITY_ID, f"defect-{model}").send_keys("Some issues with " + model)

        # Usecase input and submit
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "usecase-input").send_keys("AI is helpful in summarizing articles.")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "send-button").click()
        print("✅ Multi-model survey submitted.")

    except Exception as e:
        print("❌ Multi-checkbox test failed:", e)

    finally:
        driver.quit()

def test_future_birthdate():
    print("[SURVEY] Testing with future birthdate...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)

        # Fill in name and surname
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input").send_keys("Future")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "surname-input").send_keys("User")

        # Birthdate Picker - Select future date
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "birthdate-picker").click()
        time.sleep(1)

        try:
            # Click year to open year selector 
            year_header = driver.find_element(AppiumBy.ID, "android:id/date_picker_header_year")
            year_header.click()
            time.sleep(1)

            # Swipe to future years 
            driver.swipe(300, 700, 300, 200, 500)  # Swipe upward to reveal future years
            time.sleep(1)

            # Select a future year (for example, 2030) by tapping the appropriate element
            driver.tap([(300, 500)])  
            time.sleep(1)

            # Select a day (e.g., 15th of the month)
            driver.tap([(300, 400)])  
            time.sleep(0.5)

            # Hit OK to confirm the date
            ok_button = driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("OK")')
            ok_button.click()
        except Exception as e:
            print(f"Error selecting future date: {e}")
            # Fallback: Tap on a different area if the direct method fails
            driver.tap([(500, 1000)])  

        time.sleep(1)

        # Education Picker 
        driver.find_element(AppiumBy.XPATH, "//android.widget.Spinner[1]").click()
        time.sleep(1)
        driver.tap([(200, 1200)])  
        time.sleep(1)

        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "city-input").send_keys("Future City")

        # Gender Picker
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                            'new UiSelector().className("android.widget.Spinner").instance(1)').click()
        time.sleep(1)
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                            'new UiSelector().text("Female")').click()
        time.sleep(1)

        # Add AI model selection
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "checkbox-ChatGPT").click()
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "defect-ChatGPT").send_keys("Future issues")

        # Add use case for AI
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "usecase-input").send_keys("Testing with future date")

        # Check for validation error or submit button
        time.sleep(2)
        send_buttons = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, "send-button")
        if send_buttons:
            print("Form allows future birthdate - this might be a validation issue")
            send_buttons[0].click()
        else:
            print("✅ Form correctly prevents submission with future birthdate")

    except Exception as e:
        print(f"❌ Future birthdate test failed: {e}")

    finally:
        driver.quit()


def test_missing_gpt_model():
    print("[SURVEY] Testing without selecting GPT model...")
    driver = setup_driver()

    try:
        login_and_go_to_survey(driver)

        # Fill in name and surname
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "name-input").send_keys("No")
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "surname-input").send_keys("Model")

        # Birthdate Picker
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "birthdate-picker").click()
        time.sleep(1)
        driver.tap([(500, 1000)])
        time.sleep(1)
        
        # Education picker
        driver.find_element(AppiumBy.XPATH, "//android.widget.Spinner[1]").click()
        time.sleep(1)
        driver.tap([(200, 1200)])
        time.sleep(1)
        
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "city-input").send_keys("No Model City")
        
        # Gender picker
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                         'new UiSelector().className("android.widget.Spinner").instance(1)').click()
        time.sleep(1)
        driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 
                         'new UiSelector().text("Female")').click()
        time.sleep(1)

        # Skip selecting any AI model checkboxes
        driver.find_element(AppiumBy.ACCESSIBILITY_ID, "usecase-input").send_keys("Testing without AI model")

        # Check for send button
        time.sleep(2)
        send_buttons = driver.find_elements(AppiumBy.ACCESSIBILITY_ID, "send-button")
        if send_buttons:
            print("Form allows submission without selecting AI model - validation issue")
            send_buttons[0].click()
        else:
            print("✅ Form correctly prevents submission without AI model selected")

    except Exception as e:
        print(f"❌ Missing model test failed: {e}")

    finally:
        driver.quit()


if __name__ == "__main__":
    test_all_fields_and_submit()
    test_missing_required_fields()
    test_toggle_multiple_checkboxes()
    test_future_birthdate()
    test_missing_gpt_model()
    test_network_failure_during_submission()