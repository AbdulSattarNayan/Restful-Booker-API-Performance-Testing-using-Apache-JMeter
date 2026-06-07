# Restful-Booker-API-Performance-Testing-using-Apache-JMeter

## Project Overview

This project demonstrates performance testing of the Restful Booker API using Apache JMeter.
The test suite evaluates API performance, response time, throughput, scalability, and error handling under load conditions.

The project includes:

* JMeter Test Plan (`.jmx`)
* Result Log File (`.jtl`)
* HTML Dashboard Report
* Performance Metrics Analysis

---

## Tools & Technologies

* Apache JMeter
* Restful Booker API
* HTML Dashboard Report
* CSV/JTL Result Files
* Git & GitHub

---

## Project Structure

```bash
project-folder/
│
├── TestPlan/
│   └── Restful-booker_API_Performance_testing.jmx
│
├── Results/
│   └── results.jtl
│
├── Report/
│   └── index.html
│
├── Screenshots/
│
└── README.md
```

---

## Test Scenarios

The following API operations were tested:

* Authentication API
* Create Booking
* Get Booking
* Update Booking
* Delete Booking

---

## Performance Metrics Covered

* Response Time
* Throughput
* Error Percentage
* APDEX Score
* Requests Summary
* Concurrent Users Handling

---

## Running the Test

### Run JMeter Test in Non-GUI Mode

```bash
jmeter -n -t Restful-booker_API_Performance_testing.jmx -l results.jtl
```

### Generate HTML Dashboard Report

```bash
jmeter -g results.jtl -o report
```

### Run and Generate Report Together

```bash
jmeter -n -t Restful-booker_API_Performance_testing.jmx -l results.jtl -e -o report
```

---

## Dashboard Report

The HTML dashboard contains:

* APDEX Report
* Statistics Table
* Throughput Graph
* Response Time Graph
* Error Analysis

To view the report:

```bash
report/index.html
```

Open the file in any browser.

---

## Learning Outcomes

Through this project, I learned:

* API Performance Testing
* Load & Stress Testing
* JMeter Test Plan Design
* Report Generation & Analysis
* Performance Metrics Interpretation

---

## Author

Md Abdul Sattar Nayan

Department of Computer Science & Engineering
Comilla University

---

## License

This project is for educational and learning purposes.
