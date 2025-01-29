# 🚲 VTeam-05 Scooter Rental System

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/albinr/vteam-05/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/albinr/vteam-05/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/albinr/vteam-05/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/albinr/vteam-05/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/albinr/vteam-05/badges/build.png?b=main)](https://scrutinizer-ci.com/g/albinr/vteam-05/build-status/main)

A complete system for managing **electric scooter rentals** across Swedish cities. The system enables **customers** to rent scooters and **admins** to manage fleet operations.

---

## **🚀 Features**
### **For Admins**
✅ Real-time scooter tracking on an interactive map  
✅ Manage customers, scooters, charging stations, and parking zones  
✅ Monitor ride history and payments  

### **For Customers**
✅ Rent and return scooters via a **mobile app**  
✅ View trip and payment history  
✅ Find available scooters and parking zones  

### **Simulation**
✅ Python-based **simulation engine** to test large-scale operations  
✅ Simulate scooter movement, rentals, and battery depletion  

---

## **🛠️ Tech Stack**
| Component   | Technologies |
|-------------|-------------|
| **Frontend** | Next.js, Leaflet.js (Maps) |
| **Backend**  | Express.js, REST API, WebSockets, MariaDB |
| **Simulation** | Python |
| **Infrastructure** | Docker, GitHub Actions, Scrutinizer |

---

## **📦 Installation & Setup**
### **Prerequisites**
- Install [Docker](https://www.docker.com/) (for containerized deployment)

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/albinr/vteam-05.git
cd vteam-05
```

### **2️⃣ Start the System**
```bash
docker compose up -d
```

---

## **🔗 API Documentation**
For a detailed list of available API routes, refer to:  
[REST API Routes (Google Sheets)](https://docs.google.com/spreadsheets/d/e/2PACX-1vRlGTuAoIHx3jIDCrChokxqpFRvFJrLsbMqwO3ub-vSKPpKAn8tkuMH-kI8JGwn88bw5Nv5XKZSIEYI/pubhtml)

---

## **🤝 Contributors**
| Name | GitHub Profile |
|------|--------------|
| **Marcus Nilsson Ahlin** | [GitHub](https://github.com/username) |
| **Tobias Ralf** | [GitHub](https://github.com/username) |
| **Tim Swärd** | [GitHub](https://github.com/username) |
| **Albin Ryberg** | [GitHub](https://github.com/albinr) |

---

## **📝 License**
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

