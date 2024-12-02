document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const searchButton = document.getElementById('search-button');
    const countryInput = document.getElementById('country');
    const indicatorInput = document.getElementById('indicator');

    const descriptionParagraph = document.getElementById('indicator-description');

    //const chartCanvas = document.getElementById('data-chart');
    const calendarTableBody = document.getElementById('calendar-table').querySelector('tbody');
    const chartTypeSelect = document.getElementById('chart-type');
    const dateRangeSelect = document.getElementById('date-range');
    const downloadCsvButton = document.getElementById('download-csv');
    const downloadJsonButton = document.getElementById('download-json');

    const calendarButton = document.getElementById('calendar-button-picker');
    const datePickerContainer = document.querySelector('.date-picker-container');
    const form_historic_date = datePickerContainer.querySelector('form');
    
    const date_historic_From_Input = document.getElementById('date-historic-From');
    const date_historic_To_Input = document.getElementById('date-historic-To');

    const countryNameToCode = {
        "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD", "Angola": "AO", "Argentina": "AR", 
        "Armenia": "AM", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", 
        "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", 
        "Bhutan": "BT", "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", "Brunei": "BN", 
        "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", 
        "Cape Verde": "CV", "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN", "Colombia": "CO", 
        "Comoros": "KM", "Congo": "CG", "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", 
        "Czech Republic": "CZ", "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", 
        "East Timor": "TL", "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", 
        "Estonia": "EE", "Eswatini": "SZ", "Ethiopia": "ET", "Fiji": "FJ", "Finland": "FI", "France": "FR", "Gabon": "GA", 
        "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Greece": "GR", "Grenada": "GD", "Guatemala": "GT", 
        "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Honduras": "HN", "Hungary": "HU", 
        "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE", "Israel": "IL", 
        "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", 
        "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", 
        "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Madagascar": "MG", "Malawi": "MW", 
        "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Marshall Islands": "MH", "Mauritania": "MR", 
        "Mauritius": "MU", "Mexico": "MX", "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", 
        "Montenegro": "ME", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR", 
        "Nepal": "NP", "Netherlands": "NL", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", 
        "North Korea": "KP", "North Macedonia": "MK", "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palau": "PW", 
        "Panama": "PA", "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL", "Portugal": "PT", 
        "Qatar": "QA", "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC", 
        "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM", "Sao Tome and Principe": "ST", 
        "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", 
        "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA", "South Korea": "KR", 
        "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Suriname": "SR", "Sweden": "SE", 
        "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", 
        "Togo": "TG", "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM", 
        "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB", 
        "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Vatican City": "VA", "Venezuela": "VE", 
        "Vietnam": "VN", "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW"
    };

    let currentChart = null;
    let currentData = null;

    function adjustPosition() {
        const buttonRect = calendarButton.getBoundingClientRect();
        const containerHeight = datePickerContainer.offsetHeight;
        
        if (buttonRect.top < containerHeight) {
            // Not enough space above, position below
            datePickerContainer.style.bottom = 'auto';
            datePickerContainer.style.top = '100%';
        } else {
            // Enough space above, position above
            datePickerContainer.style.top = 'auto';
            datePickerContainer.style.bottom = '100%';
        }
    }

    window.addEventListener('resize', adjustPosition);

    // Hide date picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!datePickerContainer.contains(e.target) && e.target !== calendarButton) {
            datePickerContainer.classList.remove('show');
            adjustPosition();
        }
    });    

    // Show date picker when calendar button is clicked
    calendarButton.addEventListener('click', (e) => {
        e.stopPropagation();
        datePickerContainer.classList.toggle('show');
        adjustPosition();
    });

    // Hide date picker when form is submitted
    form_historic_date.addEventListener('submit', async (e) => {
        e.preventDefault(); // Remove this if you want the form to actually submit
        datePickerContainer.classList.remove('show');
        adjustPosition();

        const country = countryInput.value.trim().replace(/[^a-zA-Z0-9\s]/g, '');
        const indicator = indicatorInput.value.replace(/[^a-zA-Z0-9\s]/g, '');

        const dateFrom_ = date_historic_From_Input.value.trim().replace("/","-");
        const dateTo_ = date_historic_To_Input.value.trim().replace("/","-");
    
        if (!country) {
            highlightIfEmpty(countryInput);
            countryInput.focus(); 
        }else{
            try {
                const response = await fetch(`/search_historic?country=${country}&indicator=${indicator}&from_date=${dateFrom_}&to_date=${dateTo_}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (!data) {
                    throw new Error('No data received');
                }
                if (data.error) {
                    alert(`Error: ${data.error}`);
                    return;
                }  
                // Update calendar table
                updateCalendarTable(data.calendar_data);

                return data;
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }        
        
    });

    function highlightIfEmpty(inputElement) {
        // Fix: 'boxshadow' should be 'boxShadow' (camelCase)
        inputElement.style.boxShadow = `0 0 0 0.2rem ${getComputedStyle(root).getPropertyValue('--input-empty-shadow')}`;
    }
    
    function restoreHighlight(inputElement) {
        // Fix: 'boxshadow' should be 'boxShadow' (camelCase)
        inputElement.style.boxShadow = ``;
    }
    
    // Add blur (unfocus) event listener
    countryInput.addEventListener('blur', function() {
        restoreHighlight(this);
    });
    
    // Update on input
    countryInput.addEventListener('input', function() {
        if (this.value.trim()) {
            restoreHighlight(this);
        } else {
            highlightIfEmpty(this);
        }
    });

    countryInput.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            // Trigger the search button click event
            searchButton.click();
        }
    });
    indicatorInput.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            // Trigger the search button click event
            searchButton.click();
        }
    });
    
    searchButton.addEventListener('click', async () => {
        const country = countryInput.value.trim().replace(/[^a-zA-Z0-9\s]/g, '');
        const indicator = indicatorInput.value.replace(/[^a-zA-Z0-9\s]/g, '');
    
        if (!country) {
            highlightIfEmpty(countryInput);
            countryInput.focus(); 
        }else{
            try {
                const response = await fetch(`/search?country=${country}&indicator=${indicator}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.error) {
                    alert(`Error: ${data.error}`);
                    return;
                }

                currentData = data;

                // Update description
                descriptionParagraph.textContent = data.description;

                // Update calendar table
                updateCalendarTable(data.calendar_data);

                // Update chart
                updateChart(data.historical_data);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }        
    });

    function updateCalendarTable(calendarData) {
        calendarTableBody.innerHTML = ''; // Clear existing rows

        if (!calendarData || calendarData.length === 0) {
            const newRow = calendarTableBody.insertRow();
            const newCell = newRow.insertCell();
            newCell.colSpan = 8;
            newCell.textContent = 'No calendar data available for the selected country and indicator.';
            return;
        }
        const countryFlag = getCountryFlag(countryNameToCode[calendarData[0]["Country"]]);

        calendarData.forEach(item => {
            const newRow = calendarTableBody.insertRow();
            const dateCell = newRow.insertCell();
            const indicatorCell = newRow.insertCell();
            const eventCell = newRow.insertCell();
            const actualCell = newRow.insertCell();
            const previousCell = newRow.insertCell();
            const teForecastCell = newRow.insertCell();
            const forecastCell = newRow.insertCell();
            const growthCell = newRow.insertCell();

            dateCell.textContent = item.Date;
            indicatorCell.textContent = item.Category;
            indicatorCell.appendChild(countryFlag);
            eventCell.appendChild(Object.assign(document.createElement('a'), {href: `${item.SourceURL}`, textContent: item.Event}));
            actualCell.textContent = item.Actual;
            previousCell.textContent = item.Previous;
            teForecastCell.textContent = item.TEForecast;
            forecastCell.textContent = item.Forecast;
            growthCell.textContent = item['Sign of Growth']; // Accessing with bracket notation because of space in key name
        });
    }

    function renderChart(historicalData_, chartData) {
        Highcharts.stockChart('chartContainer', {
            rangeSelector: {
                selected: 1
            },
            title: {
                text: `${historicalData_[0]["Country"]} ${historicalData_[0]["Category"]}`
            },
            xAxis: {
                type: 'datetime',  // Use datetime for x-axis
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: `${historicalData_[0]["HistoricalDataSymbol"]}`
                }
            },
            series: [{
                name: 'Value',
                data: chartData
            }],
            tooltip: {
                xDateFormat: '%Y-%m-%d',  // Format the tooltip for date display
                shared: true
            },
            accessibility: {
                enabled: false
            }
        });
    }


    function updateChart(historicalData) {
        if (!historicalData || historicalData.length === 0) {
            alert('No historical data available for the selected country and indicator.');
            return;
        }

        const chartData = historicalData.map(item => {
            return {
                x: new Date(item.DateTime).getTime(),  // Convert date to timestamp
                y: item.Value
            };
        });
        renderChart(historicalData, chartData);
    }

    chartTypeSelect.addEventListener('change', () => {
        if (currentData) {
            updateChart(currentData.historical_data);
        }
    });


    downloadCsvButton.addEventListener('click', () => {
        if (!currentData || !currentData.historical_data) {
            alert('No data to download.');
            return;
        }
        downloadData('csv', currentData.historical_data);
    });

    downloadJsonButton.addEventListener('click', () => {
        if (!currentData || !currentData.historical_data) {
            alert('No data to download.');
            return;
        }
        downloadData('json', currentData.historical_data);
    });

    function downloadData(fileType, data) {
        const jsonData = JSON.stringify(data, null, 2); // For JSON download

        let csvContent = "Date,Value\n";  // For CSV download
        data.forEach(item => {
            csvContent += `${item.Date},${item.Value}\n`;
        });


        const blob = new Blob([fileType === 'json' ? jsonData : csvContent], { type: `application/${fileType}` });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `data.${fileType}`;
        link.click();
    }
    
    function getCountryFlag(countryCode) {
        const flagImg = document.createElement('img');
        flagImg.src = `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
        flagImg.alt = `${countryCode} flag`;
        flagImg.style.marginLeft = '8px';  // Optional: Add spacing between text and flag
        return flagImg;  // Return the flag image as HTML content
    }    

});