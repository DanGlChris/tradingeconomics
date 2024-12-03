# Trading Economics Data Viewer

This application allows you to view and analyze economic data from Trading Economics, including historical data charts and an economic calendar.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Python 3:** Make sure you have Python 3 installed on your system.  You can download it from [https://www.python.org/downloads/](https://www.python.org/downloads/).
* **Flask:** This app uses the Flask web framework
* **Pandas:** This app uses also the Pandas. Install them using pip:
  ```bash
  pip install Flask pandas

    Highcharts: This app uses Highcharts for charting. You'll need to include the Highcharts library in your HTML (see index.html). The free, non-commercial version is sufficient for development/testing.
    Chart.js: This app uses Chart.js for additional charting functionality. Make sure you include the Chart.js library in your HTML.

Installing

    Clone the repository:

git clone https://github.com/DanGlChris/tradingeconomics.git

Navigate to the project directory:

    cd YOUR_PATH/tradingeconomics

Running the app

    Start the Flask development server:

    python run.py

    Open your web browser:
    Navigate to http://127.0.0.1:5000/ or http://localhost:5000/ in your web browser.

Usage

    Search for Data: Enter a country and an economic indicator (e.g., "United States", "Inflation Rate") in the search fields and click the search button.
    View Indicator Description: The description of the selected indicator will be displayed.
    Explore Historical Data Chart: The chart will show the historical data for the chosen indicator. Use the chart controls to download the data in CSV or JSON format.
    Browse the Economic Calendar: The calendar displays upcoming economic events for the selected country. Use the date picker to filter the calendar by date range.

Project Structure

    run.py: The main Python file that starts the Flask application.
    templates/index.html: The HTML template for the user interface.
    static/css/style.css: The CSS file for styling the application.
    static/js/index.js: The JavaScript file for handling user interactions and data visualization.

Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.
License

This project is licensed under the MIT License.