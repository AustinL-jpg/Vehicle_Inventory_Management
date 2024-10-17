# Project_3: Vehicle inventory management

Project Description: 

The new age of technology is here and with the increase in demand for the used and new car market it is hard for dealerships to keep their customers satisfied. With issues such as supply chain delays, digital transformation and online compention, and inefficient dealership processes. To combat these issues our dashboard was created to help dealerships organize their inventory and stay on top of the stock of each of the vehicles, in turn allowing for more efficient processes, increases in the supply chain, and adapting to the digital transformation. 
![project 3](https://github.com/user-attachments/assets/0c102a80-1692-4eef-bcae-6551f32ee003)

Dataset used: 

  - Opendatasoft All Vehicle Models

  - Mock Data (Created by us to fill in necessary informaton) 

# Process:

There were 3 main resources we used to develop our dashboard to make it function. From creating data to forming visualizations.
  1. Creating mock data in python using pandas and vscode.
  2. Cleaning our main dataset in python using pandas.
  3. Database creation using pymongo and mongodb.
  4. Flask app creation using pandas and pymongo in order to connect to the database and pull data.
  5. Bootstrap for html and css to style and create a base model for our dashboard.
  6. Javascript plotly and d3 for interactive visualizations in the dashboard.

# Dashboard Features: 

Interactive dropdowns for user selection. 

Three dropdowns are in place where users can select the Make, Model, and year for each vehicle in their inventory. 
![project 3](https://github.com/user-attachments/assets/427dce21-4625-4e53-a9d8-c84f46d43c3b)

Interactive Line Graphs.

Line graph showing how the mpg has changed over the years based on the make, model, and year will display. 
![proejct 3 graph](https://github.com/user-attachments/assets/c1a26433-843e-4d3e-8ba7-f4c85d4d530d)

Vehicle Information.

Upon selecting a vehicles make, model, and year the information on the vehicles will show. 
![image](https://github.com/user-attachments/assets/b641739f-5ccf-4671-b149-fdfda2561b33)


# Dynamic Graphs. 
With the selection of make, model, and year the graphs will change showing the current model vs. the current inventory, make vs percentage of inventory, 

# Instructions for use: 

This dashboard is only functional when hosted localy on a computer using the flask app. In order to run the dashboard you must: 

  1. Clone the repository to your device.
  2. Find the monogodb python file.
  3. Run the code to create the database.
  4. Open mongo compass to confirm it has been created.
  5. Find the app.py file.
  6. Run the app.py file in your terminal.
  7. With live server open the HTML from vscode, or after running the flask locate the server link and copy it into a browser.
  8. With the dashboard up the dropdown menus will be active and the graphs will be dynamicly changing with the selected vehicle.

# Features for Future Updates.

  - Addition of prices to show the estimated sales prices for each vehicle. 
  - API for images of each vehicle so when the user selects a make model and year it shows a picture along with the information about the car. 
  



   
