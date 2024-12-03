from flask import Flask, render_template, jsonify, request
import requests
import pandas as pd
import os
from datetime import datetime, timedelta
import re


API_KEY = '55801b0c9a9c45d:s4pb7uh0wrb1aqy'
app = Flask(__name__)

# Helper function to fetch data from Trading Economics API
def fetch_te_data(url):
    try:
        data = requests.get(f'{url}?c={API_KEY}').json()
        if isinstance(data, list) and not data:
            return None, "Data not found"
        return data, None
    except requests.exceptions.RequestException as e:
        return None, str(e)
    except ValueError as e:
        return None, str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search_historic', methods=['GET'])
def search_historic_data():    
    country = request.args.get('country')
    indicator = request.args.get('indicator')
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')

    country_ = country.replace(" ", "%20")
    indicator_ = indicator.replace(" ", "%20")

    calendar_data_ = []

    if country != "":
         # Fetch calendar data
        calendar_url = f'https://api.tradingeconomics.com/calendar/country/{country_.lower()}/{from_date}/{to_date}'
        calendar_data, calendar_error = fetch_te_data(calendar_url)

        if calendar_error:
            return jsonify({'error': f'Error fetching calendar data: {calendar_error}'}), 500

        calendar_df = pd.DataFrame(calendar_data) if calendar_data else pd.DataFrame()   

        # Filter calendar data for the selected indicator
        if not calendar_df.empty:
            calendar_df = calendar_df[['Date','Country', 'Category', 'Event', 'SourceURL', 'Actual', 'Previous', 'TEForecast', 'Forecast']]
            calendar_df['Date'] = pd.to_datetime(calendar_df['Date'], format='ISO8601', utc=True)
            calendar_df['Sign of Growth'] = calendar_df.apply(lambda row: calculate_growth(row['Actual'], row['Previous']), axis=1)
            calendar_df = calendar_df.fillna('N/A')
            calendar_data_ = calendar_df[:-1].to_dict(orient='records')

        # Prepare data for response
    response_data = {
        'calendar_data': calendar_data_
    }

    return jsonify(response_data)

@app.route('/search', methods=['GET'])
def search_data():
    country = request.args.get('country')
    indicator = request.args.get('indicator')

    country_ = country.replace(" ", "%20")
    indicator_ = indicator.replace(" ", "%20")

    calendar_data_ = []

    if country != "":
         # Fetch calendar data
        calendar_url = f'https://api.tradingeconomics.com/calendar/country/{country_.lower()}'
        calendar_data, calendar_error = fetch_te_data(calendar_url)

        if calendar_error:
            return jsonify({'error': f'Error fetching calendar data: {calendar_error}'}), 500

        calendar_df = pd.DataFrame(calendar_data) if calendar_data else pd.DataFrame()   

        # Filter calendar data for the selected indicator
        if not calendar_df.empty:
            calendar_df = calendar_df[['Date', 'Country','Category', 'Event', 'SourceURL', 'Actual', 'Previous', 'TEForecast', 'Forecast']]
            calendar_df['Date'] = pd.to_datetime(calendar_df['Date'], format='ISO8601', utc=True)
            calendar_df['Sign of Growth'] = calendar_df.apply(lambda row: calculate_growth(row['Actual'], row['Previous']), axis=1)
            calendar_df = calendar_df.fillna('N/A')
            calendar_data_ = calendar_df[:-1].to_dict(orient='records')

    if not country and not indicator:
        return jsonify({'error': 'Both country and indicator must be provided'}), 400

    if indicator_ == "":
        indicator_="Inflation%20Rate"

    # Fetch news of country's indicator
    indicator_description_url = f'https://api.tradingeconomics.com/news/country/{country_}/{indicator_}'
    decription_data, error_ = fetch_te_data(indicator_description_url)
    if error_:
        return jsonify({'error': f'Error fetching news description: {error_}'}), 500
    
    descritpion_df = pd.DataFrame(decription_data) if decription_data else pd.DataFrame()
    description_data_ = descritpion_df["description"][0]
    # Fetch historical data
    hist_url = f'https://api.tradingeconomics.com/historical/country/{country_}/indicator/{indicator_}'
    hist_data, hist_error = fetch_te_data(hist_url)
    if hist_error:
        return jsonify({'error': f'Error fetching historical data: {hist_error}'}), 500
    
    hist_data_df = pd.DataFrame(hist_data) if hist_data else pd.DataFrame()
    hist_data_ = hist_data_df[:-1].to_dict(orient='records')

    # Prepare data for response
    response_data = {
        'description': description_data_,
        'historical_data': hist_data_,
        'calendar_data': calendar_data_
    }

    return jsonify(response_data)

def calculate_growth(actual, previous):
    # 1. Handle Missing Data (NaN or 'N/A')
    if pd.isna(actual) or pd.isna(previous) or str(actual).upper() == 'N/A' or str(previous).upper() == 'N/A':
        return 'N/A'

    # 2. Extract Numerical Values using Regex
    def extract_number(value):
        if isinstance(value, (int, float)):
            return value  # If it's already a number, return it
        match = re.search(r'[-+]?\d*\.?\d+', str(value))  # Regex to find numbers (integers or decimals)
        if match:
            return float(match.group(0))
        else:
            return None  # Return None if no number is found

    actual_num = extract_number(actual)
    previous_num = extract_number(previous)

    # 3. Validate Extracted Numbers
    if actual_num is None or previous_num is None:
        return 'N/A'

    # 4. Calculate and Return Growth Direction
    if actual_num > previous_num:
        return 'Positive'
    elif actual_num < previous_num:
        return 'Negative'
    else:
        return 'Neutral'

if __name__ == '__main__':
    app.run(debug=True)