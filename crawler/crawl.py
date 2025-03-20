import os 
import re
import ast
import argparse
import logging
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
# from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from time import sleep
from datetime import datetime


logging.basicConfig(
    filename='logs/app.log', 
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logging.info("------Log file --------")


def chrome_webdriver():
    chromedriver_path = '/usr/local/bin/chromedriver'
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' \
                'Chrome/123.0.0.0 Safari/537.36'
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument('--headless')
    options.add_argument(f'user-agent={user_agent}')
    service = Service(executable_path=chromedriver_path)
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def show_more(browser):
    '''
        Click tự động vào nút hiện thị thêm
    '''
    try:
        while 1:
            show_more = browser.find_element(By.CLASS_NAME, "v5-more-product")
            show_more.find_element(By.TAG_NAME, 'a').click()
            sleep(3)
    except Exception as e:
        logging.warning(f'Can not find HTML element {e}')

def craw_product_link(browser, category_url):
    '''
        Craw dữ liệu về tên sản phầm và đường link sản phẩm
    '''
    try:
        browser.get(category_url)
        sleep(3)
        show_more(browser)
        sleep(3)
        productions_link =  []
        products = browser.find_elements(By.CLASS_NAME, "pj16-item")
        for product in products:
            product_link = product.find_element(By.TAG_NAME, 'a').get_attribute('href')
            productions_link.append(product_link)
        return productions_link
    except Exception as e:
        logging.error(f'Error when run craw_product_link function {e}')
        
    
def craw_product_info(browser, url):
    '''
        Truy cập vào link sản phẩm và craw dữ liệu chi tiết về sản phẩm.
    '''
    try:
        browser.get(url)
        sleep(5)
        # Craw item name
        item_name = browser.find_element(By.CLASS_NAME, 'header-name')
        item_name = item_name.find_element(By.TAG_NAME, 'h1').text
        # Craw color price
        origin_price = craw_origin_price(browser)
        colors, prices = craw_color_price(browser)
        option_version = crawl_option_version(browser)
        images = craw_images(browser)
        item_info = {
            "item_name": item_name,
            "url": url,
            "origin_price": origin_price,
            "colors": colors,
            "prices": prices,
            "version": option_version,
            "images": images
        }
        return item_info
    except Exception as e:
        logging.warning(f'Warning using craw_product_info function {e}')
        
def craw_origin_price(browser):
    try: 
        prices = browser.find_element(By.CLASS_NAME, "box-price")
        origin_price = prices.find_element(By.TAG_NAME, 'span').text
        return origin_price
    except Exception as e:
        prices = browser.find_element(By.CLASS_NAME, "box-price")
        origin_price = prices.find_element(By.TAG_NAME, 'strong').text
        return origin_price        
    
def craw_color_price(browser):
    try:
        list_options = browser.find_element(By.ID, 'option-color')
        colors = list_options.find_elements(By.TAG_NAME, 'span')
        colors = [color.text for color in colors]
        prices = list_options.find_elements(By.TAG_NAME, 'p')
        prices = [price.text for price in prices]
        return colors, prices
    except Exception as e:
        logging.warning('Item have not colors or price')
        return [''], ['']
        
def crawl_option_version(browser):
    version_selected = ''
    try:
        option_versions = browser.find_element(By.ID, 'option-version')
        version_selected = option_versions.find_element(By.CLASS_NAME, 'selected').text
        return version_selected
    except Exception as e:
        logging.warning(f'Warning using craw_option_version function {e}')
        return version_selected




def craw_images(browser):
    try:
        wait = WebDriverWait(browser, 10)
        unique_images = {}  # Dùng set để tránh trùng lặp

        # Lấy danh sách các màu có thể nhấn (nếu có)
        try:
            color_options = browser.find_elements(By.CSS_SELECTOR, ".custom-thumb-transform .left-info-thumb")
        except:
            color_options = []

        # Duyệt qua từng màu để nhấn và lấy ảnh
        for color in color_options:
            try:
                browser.execute_script("arguments[0].click();", color)  # Click màu
                sleep(3)  # Đợi ảnh tải

                while True:  # Nhấn "Next" để lấy toàn bộ ảnh
                    # Lấy HTML sau khi click
                    list_options = browser.find_element(By.CLASS_NAME, 'slider-banner').get_attribute("outerHTML")  
                    soup = BeautifulSoup(list_options, "html.parser")

                    # Lưu ảnh ngay sau mỗi lần nhấn
                    img_tags = soup.find_all("div", class_ = 'left-info-image')
                    for div in img_tags:
                        div_id = div.get('id')
                        if div_id and div_id not in unique_images:
                            img_tag = div.find("img")
                        if img_tag:
                            unique_images[div_id] = img_tag["src"]
                            # print(f'Đã lưu: {unique_images.values()}')  # Hoặc lưu vào file JSON / CSV

                    # Tìm nút "Next" để click
                    next_buttons = browser.find_elements(By.CLASS_NAME, "slider-next")
                    if next_buttons and next_buttons[0].is_displayed():
                        browser.execute_script("arguments[0].click();", next_buttons[0])  # Click Next
                        sleep(3)  # Đợi ảnh tải tiếp
                    else:
                        break  # Không còn nút Next thì dừng vòng lặp
            except Exception as e:
                logging.warning(f"Không thể nhấn vào màu: {e}")

        return list(unique_images.values())  # Trả về danh sách ảnh đầy đủ

    except Exception as e:
        logging.warning(f'Error extracting images: {e}')
        return []

def crawl_run(categories):
    browser = chrome_webdriver()
    products = []
    for key, value in categories.items():
        print(f'Crawing: {key} ...')
        product_links = craw_product_link(browser, value)
        for url in product_links:
            item = craw_product_info(browser, url)
            item['category'] = key
            products.append(item)
        
    products = pd.DataFrame(products)
    return products



class CSVDataBaseImport:

    def __init__(self, csv_path, folder_name):
        os.makedirs(f'data/csv/{folder_name}', exist_ok=True)
        self.folder_name = f'data/csv/{folder_name}'
        self.df = pd.read_csv(csv_path)

    def process_csv_file(self):
        self.df.rename(columns = {'Unnamed: 0':'id'}, inplace = True)
        self.df = self.df.fillna("")
        category = self.df['category'].unique().tolist()
        self.df['categoryID'] = self.df['category'].apply(lambda x: category.index(x) + 1)
        self.df['slug'] = self.df['url'].apply(lambda x: re.search(r'([^/]+)$', x).group(1))
        for row in self.df.iterrows():
            if len(ast.literal_eval(row[1].prices)) == 0:
                prices = self.process_prices_column(row[1].colors, row[1].origin_price)
                self.df.at[row[0], 'prices'] = str(prices)

        df_new = self.convert_string_to_list()
        for row in df_new.iterrows():
            if len(row[1]['images']) < len(row[1]['colors']):
                for _ in range(len(row[1]['colors']) - len(row[1]['images'])):
                    df_new.at[row[0], 'images'].append("")
            else:
                for _ in range(len(row[1]['images']) - len(row[1]['colors'])):
                    df_new.at[row[0], 'images'].pop()
        df_final = self.explode_data(df_new)
        df_final = self.clean_price(df_final)

        return df_final
    def create_category_table(self):
        columns = ["id", "category","slug"]
        category_df = pd.DataFrame(columns = columns)
        category_df['id'] = self.df['categoryID'].unqiue().tolist()
        category_df['category'] = self.df["category"].unique().tolist()
        category_df['slug'] = self.df['slug'].unique().tolist()

        category_df.to_csv("{self.folder_name}/category.csv", index = False)
        return category_df

    def create_product_table(self, df_final):
        columns = ['id', 'name', 'slug', 'description', 'isNew', 'isActive', 'isPopular', 'createdDate', 'updatedDate', 'categoryID']
        product_df = pd.DataFrame(columns = columns)
        product_df['id'] = self.df['id']
        product_df['name'] = self.df['item_name']
        product_df['slug'] = self.df['slug']
        product_df['description'] = ""
        product_df['isNew'] = True
        product_df['isActive'] = True
        product_df['isPopular'] = True
        product_df['createdDate'] = datetime.now()
        product_df['updatedDate'] = datetime.now()
        product_df['categoryID'] = self.df['categoryID'] 
        product_df.to_csv(f"{self.folder_name}/products.csv", index = False)
        return product_df

    def create_images_table(self, df_final):
        # Tạo bảng images
        columns = ['id', 'productId', 'publicId', "url"]
        images_df = pd.DataFrame(columns = columns)
        images_df['productId'] = df_final['id']
        images_df['url'] = df_final['image']
        images_df.to_csv(f"{self.folder_name}/images.csv", index = False)
        return images_df
    def create_attribute_table(self, df_final):
        attribute = {
            "id": [1, 2],
            "name": ["ram", "color"]
        }
        attribute_df = pd.DataFrame(attribute)
        attribute_df.to_csv(f"{self.folder_name}/attribute.csv", index = False)
        return attribute_df

    def create_attribute_value_table(self, df_final):
        color_uniques = df_final['color'].unique().tolist()
        version_uniques = df_final['version'].unique().tolist()

        attributes = version_uniques + color_uniques
        attribute_value = {
            "id": [i for i in range(1 , len(attributes) + 1)],
            "value": attributes,
            "attributeId": [1 if i < len(version_uniques) else 2 for i in range(len(attributes))]
        }
        attribute_value_df = pd.DataFrame(attribute_value)
        attribute_value_df.to_csv(f"{self.folder_name}/attribute_value.csv", index = False)
        return attribute_value_df

    def create_variant_table(self, df_final):
        columns = ["id", "productID", "price", "quantity"]
        variant_df = pd.DataFrame(columns = columns)
        variant_df['id'] = [i for i in range(1, len(df_final) + 1)]
        variant_df['price'] = df_final["price"]
        variant_df['productID'] = df_final['id']
        variant_df['quantity'] = 100
        variant_df.to_csv(f"{self.folder_name}/variant.csv", index = False)

        return variant_df

    def create_variant_attribute_value_table(self, variant_df, attribute_value_df):
        columns = ['variantID','attributeValueID']
        variant_attribute_value_df = pd.DataFrame(columns = columns)
        variant_attribute_value_df['variantID'] = variant_df['id']
        variant_attribute_value_df['attributeValueID'] = attribute_value_df['id']
        variant_attribute_value_df.to_csv(f"{self.folder_name}/variant_attribute_value.csv", index = False)

        return variant_attribute_value_df

    def process_prices_column(self, colors, origin_price):
        colors = ast.literal_eval(colors)
        prices = [origin_price for _ in range(len(colors))]
        return prices

    def convert_string_to_list(self):
        df_new = self.df.copy()
        df_new['colors'] = df_new['colors'].apply(lambda x: ast.literal_eval(x))
        df_new['prices'] = df_new['prices'].apply(lambda x: ast.literal_eval(x))
        df_new['images'] = df_new['images'].apply(lambda x: ast.literal_eval(x))
        return df_new

    def explode_data(self, df):
        columns = ['id', 'item_name', 'url', 'origin_price', 'color', 'price','version', 'image', 'category']
        df_final = pd.DataFrame(columns = columns)
        for _, row in df.iterrows():
            new_row = {
                "id": row['id'],
                "item_name": row['item_name'],
                "url": row['url'],
                "origin_price": row['origin_price'],
                "color": row['colors'],
                "price": row['prices'],
                "version": row['version'],
                "image": row['images'],
                "category": row['category']
            }

            df_row = pd.DataFrame([new_row])
            df_row = df_row.explode(['color', 'price', 'image'])
            df_final = pd.concat([df_final, df_row], ignore_index=True)
        return df_final

    def clean_price(self, df):
        def normalize_price(origin_price, price):
            if int(origin_price) > int(price):
                return origin_price
            else:
                return price

        for row in df.iterrows():
            df.at[row[0], 'price'] = re.sub(r"[^\d]", "", row[1]['price'])
            df.at[row[0], 'origin_price'] = re.sub(r"[^\d]", "", row[1]['origin_price'])
        for row in df.iterrows():
            if row[1]['price'] == "":
                df.at[row[0], 'price'] = row[1]['origin_price']
        for row in df.iterrows():
            try:
                df.at[row[0], 'origin_price'] = normalize_price(row[1]['origin_price'], row[1]['price'])
            except:
                print(row[1]["price"])
        return df

    def run(self):
        logging.info('---START PROCESS CSV FILE---')
        df_final = self.process_csv_file()
        product_df = self.create_product_table(df_final)
        image_df = self.create_images_table(df_final)
        attribute_df = self.create_attribute_table(df_final)
        attribute_value_df = self.create_attribute_value_table(df_final)
        variant_df = self.create_variant_table(df_final)
        variant_attribute_value = self.create_variant_attribute_value_table(variant_df, attribute_value_df)



def pipeline(categories):
    print("====START PIPELINE====")
    for category in categories:
        browser = chrome_webdriver()
        name = category['name']
        brands = category['brand']
        df = crawl_run(brands)
        df.to_csv(f"data/origin/{name}.csv")
        logging.info("===CRAW SUCESSFULLY===")
        csv_processer = CSVDataBaseImport(csv_path = f"data/origin/{name}.csv", folder_name = name)
        csv_processer.run()
        logging.info("===PROCESS CSV FILE SUCCESSFULLY===")

# Test
phone_categories = {
    "Iphone": "https://hoanghamobile.com/dien-thoai-di-dong/iphone",
    "Samsung": "https://hoanghamobile.com/dien-thoai-di-dong/samsung",
    "Xiaomi": "https://hoanghamobile.com/dien-thoai-di-dong/xiaomi",
    "Oppo": "https://hoanghamobile.com/dien-thoai-di-dong/oppo",
    "Vivo": "https://hoanghamobile.com/dien-thoai-di-dong/vivo",
}

laptop_categories = {
    "MACBOOK": "https://hoanghamobile.com/laptop/macbook",
    "MSI": "https://hoanghamobile.com/laptop/msi",
    "ASUS": "https://hoanghamobile.com/laptop/asus",
    "DELL": "https://hoanghamobile.com/laptop/dell",
    "HP": "https://hoanghamobile.com/laptop/hp",
    "LENOVO": "https://hoanghamobile.com/laptop/lenovo",
    "LG": "https://hoanghamobile.com/laptop/hang-san-xuat/lg",
    "ACER": "http://hoanghamobile.com/laptop/hang-san-xuat/acer"
}

tablet_categories = {
    "iPad": "https://hoanghamobile.com/tablet/ipad",
    "Samsung": "https://hoanghamobile.com/tablet/samsung",
    "Xiaomi": "https://hoanghamobile.com/tablet/xiaomi",
    "Nokia": "https://hoanghamobile.com/tablet/nokia",
    "TCL": "https://hoanghamobile.com/tablet/tcl",
    "Lenovo": "https://hoanghamobile.com/tablet/lenovo",
    "Oppo": "https://hoanghamobile.com/tablet/oppo",
    "HUAWEI": "https://hoanghamobile.com/tablet/huawei"
}

screen_categories = {
    "MSI": "https://hoanghamobile.com/man-hinh/hang-san-xuat/msi",
    "Xiaomi": "https://hoanghamobile.com/man-hinh/hang-san-xuat/xiaomi",
    "ASUS": "https://hoanghamobile.com/man-hinh/hang-san-xuat/asus",
    "DELL": "https://hoanghamobile.com/man-hinh/hang-san-xuat/dell",
    "Samsung": "https://hoanghamobile.com/man-hinh/hang-san-xuat/samsung",
}

headphone_categories = {
    "Apple": "https://hoanghamobile.com/tai-nghe/apple-airpods",
    "Samsung": "https://hoanghamobile.com/tai-nghe/samsung",
    "Sony": "https://hoanghamobile.com/tai-nghe/sony",
    "JBL": "https://hoanghamobile.com/tai-nghe/jbl",
    "Soundpeats": "https://hoanghamobile.com/tai-nghe/soundpeats",
    "Baseus": 'https://hoanghamobile.com/tai-nghe/baseus'
}

charger_categories = {
    "Charger": 'https://hoanghamobile.com/cu-sac-day-cap'
}

backup_charger_categories = {
    "AEZER": "https://hoanghamobile.com/sac-du-phong/aezer",
    "HYPER": "https://hoanghamobile.com/sac-du-phong/hyper",
    "ENERGIZER": "https://hoanghamobile.com/sac-du-phong/energizer",
    "INNOSTYLE": "https://hoanghamobile.com/sac-du-phong/innostyle"
}

categories = [
    {"name": "laptop",
    "brand": laptop_categories},
    # {"name": "tablet",
    # "brand": tablet_categories},
    # {"name": "screen",
    # "brand": screen_categories},
    # {"name": "headphone",
    # "brand": headphone_categories},
    # {"name": "charger",
    # "brand": charger_categories},
    # {"name": "backup_charger",
    # "brand": backup_charger_categories}
]


# ## RUNNING
# pipeline(categories)
csv_processer = CSVDataBaseImport(csv_path = f"data/origin/laptop.csv", folder_name = "laptop")
csv_processer.run()