# Google Ads Shopping Product Labelizer

## Overview
This script is designed for Google Ads users who need to analyze and manage their shopping campaign performance data. It retrieves shopping performance data from Google Ads and processes it based on specific metrics and custom labels. The script allows users to sort and filter products based on performance criteria and save the processed data into a Google Sheet for further analysis and visualization.

## Features
Data Retrieval: Fetches shopping performance data from Google Ads over a specified period.
Product Type Classification: Classifies products into categories like 'Overperformer', 'Good Performer', 'Medium Performer', etc., based on performance metrics.
Data Sorting and Filtering: Sorts products by their ID and filters them based on custom criteria like conversion rates, impressions, and break-even ROAS (Return on Ad Spend).
Custom Label Assignment: Assigns custom labels to products for easier categorization and analysis.
Google Sheets Integration: Saves and updates product data in a specified Google Sheet for record-keeping and easy access.
Configuration
Before running the script, ensure the following settings are configured according to your requirements:

### SPREADSHEET_URL: 
The URL of the Google Sheet where the data will be saved.
### selectedCustomLabel: 
The index of the custom label to use (ranging from 0 to 4).
### breakevenRoas: 
The break-even Return on Ad Spend.
### AverageCvr: 
The average conversion rate.
### impressionThreshold: 
The minimum number of impressions to classify a product as having low impressions.
### daysAgo: 
The number of days in the past to retrieve data for.
### feedLabels: 
Array of labels used to filter the data based on country or language, e.g., ['en', 'de', 'us'].

## Functions
### main()
The main function that orchestrates the data retrieval, processing, and saving.

### getFilteredShoppingProducts(daysAgo)
Fetches shopping performance data for the specified number of days in the past.

### formatOfferId(offerId)
Formats the offer ID to ensure it follows the expected pattern, particularly for country codes.

### pushToSpreadsheet(data)
Pushes the processed data to the specified Google Sheet.

### setCustomLabelInSheet()
Sets the custom label in the Google Sheet based on the selected custom label index.

### saveProductDataWithTimestamp(products)
Saves product data along with a timestamp in a separate sheet named save_data for historical analysis.

## Usage
### To use this script:

Copy the entire script into your Google Ads Script editor.
Set the SPREADSHEET_URL and other configuration settings according to your campaign needs.
Schedule the script to run at your preferred frequency (e.g., daily, weekly).

### Limitations and Considerations
Ensure that the Google Sheet specified in SPREADSHEET_URL exists and is accessible.
The script does not modify any campaign settings or bid strategies. It only retrieves and processes data.
Custom labels must be properly set up in the Google Merchant Center for the script to classify products accurately.

## Support
For support, issues, or enhancements, please file an issue on the GitHub repository page where this script is hosted.

### Remember to replace placeholders like SPREADSHEET_URL with actual values and ensure the script is tailored to the specific structure and needs of your Google Ads campaigns and Merchant Center setup.
