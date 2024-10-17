

d3.json("api/data").then((importedData) => {

  const carData = importedData;
  const carModel = importedData

  console.log(carData);


  // let car = carData[0]
  // console.log(car)

  // let carMake = car.make
  // console.log(carMake)


  function createDropdown(carData, key) {
    const uniqueValues = new Set();
    const firstDropdown = document.createElement('select');
    const secondDropdown = document.getElementById("secondDropdown");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "None";
    firstDropdown.appendChild(defaultOption);



    carData.forEach(item => {
      const value = item.make;
      if (!uniqueValues.has(value)) {
        
        uniqueValues.add(value);

        const option = document.createElement("option");
        option.value = item.make;
        option.text = item.make;
        firstDropdown.appendChild(option);
      }
    });

    return firstDropdown;

  }

const dropdown = createDropdown(carData);
document.body.appendChild(dropdown);

// Function to populate the second dropdown
function populateSecondDropdown() {
  const selectedValue = firstDropdown.value;
  const options = data[selectedValue];

  // Clear the existing options in the second dropdown
  secondDropdown.innerHTML = '';

  // Add new options based on the selected value
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.text = option;
    secondDropdown.appendChild(optionElement);
  });
}

// Add an event listener to the first dropdown to trigger population
firstDropdown.addEventListener('change', populateSecondDropdown);
})



// function addOption(){
// 	var select = document.getElementById("dynamic-select");
// 	select.options[select.options.length] = new Option('New Element', '0');
// }

// function removeOption(){
// 	var select = document.getElementById("dynamic-select");
// 	select.options[select.options.length - 1] = null;
// }

// function removeAllOptions(){
// 	var select = document.getElementById("dynamic-select");
// 	select.options.length = 0;
// }

// const yearSelect = document.getElementById('year');
// const makeSelect = document.getElementById('make');
// const modelSelect = document.getElementById('model');



  
//   // Function to populate the Make dropdown based on the selected Year
//   function populateMakes() {
//     const makes = new Set();
//     carData.forEach(car => makes.add(car.make));
//     console.log(carData)
  
//     makes.forEach(make => {
//       const option = document.createElement('option');
//       option.value = make;
//       option.text = make;
//       makeSelect.appendChild(option);
//     });
//   }
  

//   function populateModels() {
//     const selectedMake = makeSelect.value;
//     modelSelect.innerHTML = '<option value="">Select Model</option>';
  
//     const models = new Set();
//     carData.filter(car => car.make === selectedMake).forEach(car => models.add(car.model));
  
//     models.forEach(model => {
//       const option = document.createElement('option');
//       option.value = model;
//       option.text = model;
//       modelSelect.appendChild(option);
//     });
//   }
  
//   // Populate the Year dropdown initially
//   function populateYears() {
//     const selectedMake = makeSelect.value;
//     const selectedModel = modelSelect.value;
//     yearSelect.innerHTML = '<option value="">Select Year</option>';
  
//     const years = new Set();
//     carData.filter(car => car.make === selectedMake && car.model === selectedModel).forEach(car => years.add(car.year));
  
//     years.forEach(year => {
//       const option = document.createElement('option');
//       option.value = year;
//       option.text = year;
//       yearSelect.appendChild(option);
//     });


//   }

// // makeSelect.addEventListener('change', populateModels);
// // modelSelect.addEventListener('change', populateYears);


// // init();
