from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import unittest

# Constants
LOGIN_URL = "https://login-app-seven-zeta.vercel.app/"
SUCCESS_URL = "https://login-app-seven-zeta.vercel.app/success"

class TestLogin(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Setup Chrome WebDriver"""
        options = webdriver.ChromeOptions()
        # options.add_argument("--start-maximized")  # Ensure UI is fully visible
        # Uncomment this line to run in headless mode (for CI/CD)
        options.add_argument("--headless")
        
        cls.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    def setUp(self):
        """Ensure each test starts from the login page"""
        self.driver.get(LOGIN_URL)

    def logout(self):
        """Logs out after a successful login test"""
        driver = self.driver
        try:
            logout_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "logout-button"))
            )
            logout_button.click()
            WebDriverWait(driver, 10).until(EC.url_to_be(LOGIN_URL))
        except Exception:
            print("Logout failed or user was not logged in.")

    def test_valid_login(self):
        """Test valid login redirects to /success and then logs out"""
        driver = self.driver

        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        email_input = driver.find_element(By.NAME, "email")
        password_input = driver.find_element(By.NAME, "password")
        login_button = driver.find_element(By.NAME, "login-button")

        email_input.clear()
        password_input.clear()
        email_input.send_keys("test@example.com")
        password_input.send_keys("password123")
        login_button.click()

        WebDriverWait(driver, 10).until(EC.url_contains("success"))
        self.assertIn("success", driver.current_url.lower())

        # Logout to reset session before next test
        self.logout()

    def test_invalid_login(self):
        """Test invalid login shows error message"""
        driver = self.driver

        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        email_input = driver.find_element(By.NAME, "email")
        password_input = driver.find_element(By.NAME, "password")
        login_button = driver.find_element(By.NAME, "login-button")

        email_input.clear()
        password_input.clear()
        email_input.send_keys("invalid@example.com")
        password_input.send_keys("wrongpass")
        login_button.click()

        # Verify popup appears
        popup_container = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "popup-container"))
        )
        popup_message = driver.find_element(By.NAME, "popup-message").text
        self.assertIn("Invalid", popup_message)

        # Close popup
        close_button = driver.find_element(By.NAME, "popup-close")
        close_button.click()

    def test_empty_fields(self):
        """Test login with empty fields should not proceed"""
        driver = self.driver

        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        login_button = driver.find_element(By.NAME, "login-button")
        login_button.click()

        # Verify popup appears
        popup_container = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "popup-container"))
        )
        popup_message = driver.find_element(By.NAME, "popup-message").text
        self.assertIn("Invalid", popup_message)

        # Close popup
        close_button = driver.find_element(By.NAME, "popup-close")
        close_button.click()

    def test_google_login_button(self):
        """Test if Google login button is present and clickable"""
        driver = self.driver

        google_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "google-login")))
        self.assertTrue(google_button.is_displayed())

    def test_facebook_login_button(self):
        """Test if Facebook login button is present and clickable"""
        driver = self.driver

        fb_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "facebook-login")))
        self.assertTrue(fb_button.is_displayed())

    @classmethod
    def tearDownClass(cls):
        """Close WebDriver after tests"""
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
