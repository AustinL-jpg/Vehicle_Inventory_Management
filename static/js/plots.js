

d3.json("api/data").then((importedData) => {

  const carData = importedData;

  console.log(carData);


  let car = carData[0]
  console.log(car)

  let carMake = car.make
  console.log(carMake)


  function createDropdown(carData, key) {
    const uniqueValues = new Set();
    const select = document.createElement('select');

  // function createDropdown(carData) {
  //   const select = document.createElement("select");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select the Make";
    select.appendChild(defaultOption);



    carData.forEach(item => {
      const value = item.make;
      if (!uniqueValues.has(value)) {
        
        uniqueValues.add(value);

        const option = document.createElement("option");
        option.value = item.make;
        option.text = item.make;
        select.appendChild(option);
      }
    });

    return select;

  }

const dropdown = createDropdown(carData);
document.body.appendChild(dropdown);
})



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