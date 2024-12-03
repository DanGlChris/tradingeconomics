document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const loadingOverlay = document.getElementById('loadingOverlay');
    const searchButton = document.getElementById('search-button');
    const countryInput = document.getElementById('country');
    const indicatorInput = document.getElementById('indicator');

    const descriptionParagraph = document.getElementById('indicator-description');
    
    const errorElement = document.getElementById('error-message');

    //const chartCanvas = document.getElementById('data-chart');
    const calendarTableBody = document.getElementById('calendar-table').querySelector('tbody');
    const chartTypeSelect = document.getElementById('chart-type');
    const dateRangeSelect = document.getElementById('date-range');
    const downloadCsvButton = document.getElementById('download-csv');
    const downloadJsonButton = document.getElementById('download-json');
    const btnDownload = document.getElementById('download-action-btn');

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

    let currentData = null;
    let isFetching = false; 

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

        const country = encodeURIComponent(countryInput.value.trim().replace(/[^a-zA-Z0-9\s]/g, ''));
        const indicator = encodeURIComponent(indicatorInput.value.replace(/[^a-zA-Z0-9\s]/g, ''));

        const dateFrom_ = encodeURIComponent(date_historic_From_Input.value.trim().replace("/","-"));
        const dateTo_ = encodeURIComponent(date_historic_To_Input.value.trim().replace("/","-"));
    
        if (!country || country.toLowerCase().includes("all")) {
            highlightIfEmpty(countryInput);
            countryInput.focus(); 
        }else{
            if (isFetching) return; // Prevent multiple clicks

            isFetching = true;
            searchButton.disabled = true; // Disable the button
            loadingOverlay.style.display = 'flex';
            try {
                const response = await fetch(`/search_historic?country=${country}&indicator=${indicator}&from_date=${dateFrom_}&to_date=${dateTo_}`);
                loadingOverlay.style.display = 'none';
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
                highlightIfEmpty(countryInput);
                indicatorInput.focus();
                if (error.message.includes('HTTP error! status: 404')) {
                    displayErrorMessage('Resource not found.');
                } else if (error.message.includes('Failed to fetch')) {
                    displayErrorMessage('Network error. Please check your internet connection.');
                } else {
                    displayErrorMessage('An unexpected error occurred. Please try again later.');
                    console.error('Error fetching data:', error);
                }
            } finally {
                isFetching = false;
                searchButton.disabled = false; // Re-enable the button
                loadingOverlay.style.display = 'none';
            }
        }        
        
    });

    function displayErrorMessage(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

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
        const country = encodeURIComponent(countryInput.value.trim().replace(/[^a-zA-Z0-9\s]/g, ''));
        const indicator = encodeURIComponent(indicatorInput.value.replace(/[^a-zA-Z0-9\s]/g, ''));
    
        if (!country || country.toLowerCase().includes("all")) {
            highlightIfEmpty(countryInput);
            countryInput.focus(); 
        }else{
            try {                
                loadingOverlay.style.display = 'flex';
                const response = await fetch(`/search?country=${country}&indicator=${indicator}`);
                loadingOverlay.style.display = 'none';
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
                descriptionParagraph.textContent = !data.description ? "There is no description for this indicator." : data.description;

                // Update calendar table
                updateCalendarTable(data.calendar_data);

                // Update chart
                updateChart(data.historical_data);


            } catch (error) { 
                highlightIfEmpty(countryInput);
                indicatorInput.focus()
                console.error('Error fetching data:', error);
            }
        }        
    });

    btnDownload.addEventListener('click', function() {
        const format = document.getElementById('download-btn').value;
        downloadData(format);
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
            const countryFlag = getCountryFlag(countryNameToCode[item.Country]);

            dateCell.textContent = new Date(item.Date).toLocaleDateString();

            indicatorCell.textContent = '';
            indicatorCell.appendChild(countryFlag);
            const categoryText = document.createTextNode(" " +item.Category);
            indicatorCell.appendChild(categoryText);

            eventCell.appendChild(Object.assign(document.createElement('a'), {
                href: item.SourceURL || '#', // Provide default if SourceURL is missing
                target: '_blank',           // Open link in new tab
                rel: 'noopener noreferrer', // Security best practice
                textContent: item.Event || 'N/A' // Default text if Event is missing
            }));

            actualCell.textContent = item.Actual ?? 'N/A';
            previousCell.textContent = item.Previous ?? 'N/A';
            teForecastCell.textContent = item.TEForecast ?? 'N/A';
            forecastCell.textContent = item.Forecast ?? 'N/A';
            setGrowthIcon(growthCell, item['Sign of Growth']);
        });
    }

    function setGrowthIcon(growthCell, growthSign) {
        // Clear existing content in the cell
        growthCell.innerHTML = '';
      
        let iconElement = document.createElement('i');
        iconElement.setAttribute('aria-hidden', 'true'); // Good practice for accessibility
      
        switch (growthSign) {
          case 'Positive':
            iconElement.classList.add('fas', 'fa-arrow-up'); // Font Awesome classes for up arrow
            iconElement.style.color = 'green';
            break;
        case 'Negative':
            iconElement.classList.add('fas', 'fa-arrow-down'); // Font Awesome classes for down arrow
            iconElement.style.color = 'red';
            break;
        case 'Neutral':
            iconElement.classList.add('fas', 'fa-square'); // Font Awesome classes for square
            iconElement.style.color = 'blue';
            break;
        case 'N/A':
            iconElement.classList.add('fas', 'fa-minus'); // Font Awesome classes for minus (or use another icon)
            iconElement.style.color = 'gray';
            break;
        default:
            iconElement.classList.add('fas', 'fa-question'); // Font Awesome classes for question mark
            iconElement.style.color = 'black';
            break;
        }

        growthCell.appendChild(iconElement);
    }


    function renderChart(historicalData_, chartData) {
        if (!historicalData_ || historicalData_.length === 0) {
            // Handle the case where historicalData_ is empty
            document.getElementById('chartContainer').innerHTML = '<p>No historical data available.</p>'; // Or display an error message
            return;
        }
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
                name: `${historicalData_[0]["HistoricalDataSymbol"]}`,
                data: chartData
            }],
            tooltip: {
                xDateFormat: '%Y-%m-%d',  // Format the tooltip for date display
                shared: true,
                formatter: function() {
                    // 'this' refers to the tooltip object
                    var points = this.points;
                    var date = Highcharts.dateFormat('%Y-%m-%d', this.x); // Format the date
                    var s = '<span style="color: red;">\u25CF</span> ' + '<b>' + date + '</b>';
        
                    points.forEach(function(point) {
                        s += '<br/><span style="color:' + point.series.color + '">\u25CF</span> ' +
                            point.series.name + ': ' + point.y;
                    });
        
                    return s;
                }                
            },
            accessibility: {
                enabled: true,
            }
        });
    }


    function updateChart(historicalData) {
        if (!historicalData || historicalData.length === 0) {
            alert('No data available for the selected country and indicator.');
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
    
    function getCountryFlag(countryCode) {
        const flagImg = document.createElement('img');
        flagImg.src = `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
        flagImg.alt = `${countryCode} flag`;
        flagImg.style.marginLeft = '8px';  // Optional: Add spacing between text and flag
        return flagImg;  // Return the flag image as HTML content
    }  
    
     // Function to convert JSON data to CSV
     function jsonToCsv(jsonData) {
        const headers = Object.getOwnPropertyNames(jsonData[0]);
        const csvRows = [];

        // Add header row
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of jsonData) {
            const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }    

    // Function to trigger the download
    function downloadData(format) {
        let dataContent, filename, mimeType;

        if (format.toLowerCase().includes("csv")) {
            dataContent = jsonToCsv(currentData.historical_data);
            filename = 'data.csv';
            mimeType = 'text/csv';
        } else if (format.toLowerCase().includes("json")){ // Default to JSON
            dataContent = JSON.stringify(currentData.historical_data, null, 2); // Pretty print JSON
            filename = 'data.json';
            mimeType = 'application/json';
        } else {
            alert("Invalid download format. Please choose 'csv' or 'json'."); // Inform the user
            return;
        }

        const blob = new Blob([dataContent], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

});