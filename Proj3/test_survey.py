import unittest
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TestSurvey(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        opts = webdriver.ChromeOptions()
        opts.add_argument("--headless=new")
        opts.add_argument("--disable-gpu")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--window-size=1920,1080")

        cls.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=opts
        )
        #cls.base_url = "http://localhost:3000"
        cls.base_url = "https://login-app-seven-zeta.vercel.app"  # Change from localhost:3000
        cls.designer_url = f"{cls.base_url}/designer/test-id"

    def setUp(self):
        d = self.driver
        # 1) hit origin so `localStorage` is correct
        d.get(self.base_url)
        # 2) clear everything
        d.execute_script("localStorage.clear(); sessionStorage.clear();")
        # 3) stub in a “loggedInUser” so the auth-guard lets us in
        d.execute_script("localStorage.setItem('loggedInUser','tester');")
        # 4) now go to /designer/:surveyId
        d.get(self.designer_url)
        # 5) wait for the title field to prove the designer loaded
        WebDriverWait(d, 10).until(
            EC.presence_of_element_located((By.NAME, "survey-title"))
        )

    def test_create_mc_question(self):
        d = self.driver
        # give it a title
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "survey-title"))
        ).send_keys("MC Survey")
        # prompt
        d.find_element(By.NAME, "designer-prompt").send_keys("Q1?")
        # fill option A
        opts = d.find_elements(By.NAME, "designer-option")
        opts[0].send_keys("Opt A")
        # add option B
        d.find_element(By.ID, "add-option-1").click()
        opts = d.find_elements(By.NAME, "designer-option")
        opts[1].send_keys("Opt B")
        # add option C
        d.find_element(By.ID, "add-option-2").click()
        opts = d.find_elements(By.NAME, "designer-option")
        opts[2].send_keys("Opt C")
        # save it
        d.find_element(By.NAME, "save-question").click()

        # should see exactly one preview
        previews = WebDriverWait(d, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li[id^='preview-']"))
        )
        self.assertEqual(len(previews), 1)

        # click edit
        previews[0].find_element(By.NAME, "edit-question").click()

        # **new**: wait until exactly 3 inputs appear
        WebDriverWait(d, 10).until(lambda drv: len(drv.find_elements(By.NAME, "designer-option")) == 3)
        opts = d.find_elements(By.NAME, "designer-option")
        self.assertEqual(len(opts), 3)

    def test_add_rating_question(self):
        d = self.driver
        # title + prompt
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "survey-title"))
        ).send_keys("Rating Survey")
        d.find_element(By.NAME, "designer-prompt").send_keys("Rate us?")
        # switch to rating
        sel = d.find_element(By.NAME, "designer-type")
        for o in sel.find_elements(By.TAG_NAME, "option"):
            if o.get_attribute("value") == "rating":
                o.click()
                break
        # mark required + save
        d.find_element(By.NAME, "designer-required").click()
        d.find_element(By.NAME, "save-question").click()
        # preview should include “(rating)”
        span = WebDriverWait(d, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "li[id^='preview-'] span"))
        )
        self.assertIn("(rating)", span.text.lower())

    def test_conditional_logic_fields(self):
        d = self.driver
        # Q1: MC yes/no
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "survey-title"))
        ).send_keys("Cond Survey")
        d.find_element(By.NAME, "designer-prompt").send_keys("Q1?")
        opts = d.find_elements(By.NAME, "designer-option")
        opts[0].send_keys("Yes")
        d.find_element(By.ID, "add-option-1").click()
        opts = d.find_elements(By.NAME, "designer-option")
        opts[1].send_keys("No")
        d.find_element(By.NAME, "save-question").click()

        # Q2: text + conditional on Q1 == Yes
        d.find_element(By.NAME, "designer-prompt").send_keys("Q2?")
        sel = d.find_element(By.NAME, "designer-type")
        for o in sel.find_elements(By.TAG_NAME, "option"):
            if o.get_attribute("value") == "text":
                o.click(); break
        d.find_element(By.NAME, "designer-conditional-toggle").click()
        cond = d.find_element(By.NAME, "designer-conditional-question")
        cond.find_elements(By.TAG_NAME, "option")[1].click()
        d.find_element(By.NAME, "designer-conditional-value").send_keys("Yes")
        d.find_element(By.NAME, "save-question").click()

        # edit Q2 → verify conditional
        previews = WebDriverWait(d, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li[id^='preview-']"))
        )
        previews[1].find_element(By.NAME, "edit-question").click()
        loaded = WebDriverWait(d, 10).until(
            EC.presence_of_element_located((By.NAME, "designer-conditional-question"))
        )
        val = d.find_element(By.NAME, "designer-conditional-value").get_attribute("value")
        self.assertNotEqual(loaded.get_attribute("value"), "")
        self.assertEqual(val, "Yes")

    def test_delete_question(self):
        d = self.driver
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "survey-title"))
        ).send_keys("Del Survey")
        d.find_element(By.NAME, "designer-prompt").send_keys("A?")
        d.find_element(By.NAME, "save-question").click()
        d.find_element(By.NAME, "designer-prompt").send_keys("B?")
        d.find_element(By.NAME, "save-question").click()
        previews = d.find_elements(By.CSS_SELECTOR, "li[id^='preview-']")
        first_id = previews[0].get_attribute("id")
        previews[0].find_element(By.NAME, "delete-question").click()
        remaining = d.find_elements(By.ID, first_id)
        self.assertEqual(len(remaining), 0)

    def test_save_survey_localstorage(self):
        d = self.driver
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "survey-title"))
        ).send_keys("SaveTest")
        d.find_element(By.NAME, "designer-prompt").send_keys("X?")
        d.find_element(By.NAME, "save-question").click()
        d.find_element(By.NAME, "save-survey").click()
        WebDriverWait(d, 10).until(EC.alert_is_present())
        alert = d.switch_to.alert
        self.assertEqual(alert.text, "Survey saved")
        alert.accept()
        keys = d.execute_script("return Object.keys(localStorage);")
        self.assertTrue(any(k.startswith("survey-") for k in keys))

    def test_required_validation(self):
        d = self.driver
        dummy = {
            "id":"s1","title":"Dummy Survey",
            "questions":[
                {"id":"q1","prompt":"Are you happy?","type":"mc","options":["Yes","No"],"required":True},
                {"id":"q2","prompt":"Rate it","type":"rating","required":True}
            ]
        }
        d.get(self.base_url)
        d.execute_script(f"localStorage.setItem('survey-s1', `{json.dumps(dummy)}`);")
        d.execute_script("localStorage.setItem('loggedInUser','tester');")
        d.get(f"{self.base_url}/surveys/s1")
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.NAME, "submit-survey"))
        ).click()
        err = WebDriverWait(d, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, "div[id='question-q1'] p[class*='error']")
            )
        )
        self.assertTrue(err.is_displayed())

    def test_complete_submit(self):
        d = self.driver
        dummy = {
            "id":"s1","title":"Dummy Survey",
            "questions":[
                {"id":"q1","prompt":"Are you happy?","type":"mc","options":["Yes","No"],"required":True},
                {"id":"q2","prompt":"Rate it","type":"rating","required":True}
            ]
        }
        d.get(self.base_url)
        d.execute_script(f"localStorage.setItem('survey-s1', `{json.dumps(dummy)}`);")
        d.execute_script("localStorage.setItem('loggedInUser','tester');")
        d.get(f"{self.base_url}/surveys/s1")
        WebDriverWait(d, 10).until(
            EC.element_to_be_clickable((By.ID, "q1-opt0"))
        ).click()
        sel = WebDriverWait(d, 10).until(
            EC.presence_of_element_located((By.ID, "q2"))
        )
        for o in sel.find_elements(By.TAG_NAME, "option"):
            if o.get_attribute("value") == "1":
                o.click()
                break
        d.find_element(By.NAME, "submit-survey").click()
        WebDriverWait(d, 10).until(EC.alert_is_present())
        alert = d.switch_to.alert
        self.assertIn("Survey submitted successfully", alert.text)
        alert.accept()
        WebDriverWait(d, 10).until(EC.url_contains("/surveys"))
        self.assertIn("/surveys", d.current_url)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main(verbosity=2)
