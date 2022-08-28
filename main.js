const numberTypes = ["trivia", "math", "date", "year"];
let selectedType = "trivia";
let inputNumber = "";
let fact = "";
const app = document.getElementById("app");

function selectComponent({ items, onChange }) {
  const select = document.createElement("select");
  if (onChange) select.addEventListener("change", onChange);

  if (items && items.length)
    items.forEach((element) => {
      const option = document.createElement("option");
      option.innerText = element;
      option.value = element;

      select.appendChild(option);
    });

  return select;
}

function inputComponent({ onChange }) {
  const input = document.createElement("input");
  if (onChange) input.addEventListener("change", onChange);

  return input;
}

function buttonComponent({ onClick, chields }) {
  const button = document.createElement("button");
  button.innerHTML = chields || "Click me";
  if (onClick) button.addEventListener("click", onClick);

  return button;
}

function factComponent({ fact }) {
  const container = document.createElement("div");
  container.classList = "p-2 bg-gray mt-2";
  container.innerText = fact;

  return container;
}

function apiRequests() {
  const baseUrl = "http://numbersapi.com";

  async function getRandomInfo(numberType) {
    try {
      if (!numberTypes.includes(numberType)) {
        const message = `Wrong number type >> ${numberTypes}`;
        console.error(message);

        return {
          result: false,
          message,
        };
      }

      const response = await fetch(`${baseUrl}/random/${numberType}`);

      if (response.ok) {
        return {
          result: true,
          message: "Request success",
          data: await response.text(),
        };
      } else {
        const message = `Request return status: ${response.status}`;
        console.error(message);
        return {
          result: false,
          message,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        result: false,
        message: "OOOOPS ((((",
      };
    }
  }

  async function getInfoAboutNumber({ numberType, number }) {
    try {
      if (!numberTypes.includes(numberType)) {
        const message = `Wrong number type >> ${numberTypes}`;
        console.error(message);

        return {
          result: false,
          message,
        };
      }

      const url = `${baseUrl}/${number}${
        numberType === "trivia" ? "" : `/${numberType}`
      }`;
      const response = await fetch(url);

      if (response.ok) {
        return {
          result: true,
          message: "Request success",
          data: await response.text(),
        };
      } else {
        const message = `Request return status: ${response.status}`;
        console.error(message);
        return {
          result: false,
          message,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        result: false,
        message: "OOOOPS ((((",
      };
    }
  }

  return {
    getRandomInfo,
    getInfoAboutNumber,
  };
}

function mainComponent() {
  const api = apiRequests();

  const container = document.createElement("div");
  const factComp = factComponent({ fact });

  function onChangeSelect(event) {
    const value = event.target.value;
    selectedType = value;
  }

  function onChangeInput(event) {
    const value = event.target.value;
    inputNumber = value;
  }

  async function getRandomNumberInfo() {
    try {
      const response = await api.getRandomInfo(selectedType);

      if (!response.result || !response.data) {
        return console.error(response.message);
      }

      fact = response.data;

      factComp.innerText = fact;
    } catch (error) {
      console.error(error);
    }
  }

  async function getNumberInfo() {
    try {
      if (!inputNumber) {
        fact = 'Input number first';
  
        return factComp.innerText = fact;
      }
      
      const numReg = /^[0-9]*$/
      
      if (selectedType !== 'date' && !numReg.test(inputNumber)) {
        fact = 'Input valid first';
  
        return factComp.innerText = fact;
      }
      
      if (selectedType === 'date') {
        const regex = /^[0-9\.\-\/]+$/
        
        if (!regex.test(inputNumber)) {
          fact = 'Input valid date';
    
          return factComp.innerText = fact;
        }
        
        if (inputNumber.split('/').length > 2) {
          fact = 'Input valid date';
    
          return factComp.innerText = fact;
        }
      }

      const response = await api.getInfoAboutNumber({
        number: inputNumber,
        numberType: selectedType,
      });

      if (!response.result || !response.data) {
        return console.error(response.message);
      }

      fact = response.data;

      factComp.innerText = fact;
    } catch (error) {
      console.error(error);
    }
  }

  const select = selectComponent({
    items: numberTypes,
    onChange: onChangeSelect,
  });

  const input = inputComponent({ onChange: onChangeInput });
  
  const randomButton = buttonComponent({
    chields: "Get random fact",
    onClick: getRandomNumberInfo,
  });
  
  const inputButton = buttonComponent({
    chields: "Get number fact",
    onClick: getNumberInfo,
  });

  const flex1 = document.createElement('div')
  flex1.classList = 'flex'

  const flex2 = document.createElement('div')
  flex2.classList = 'flex mt-2'

  flex1.appendChild(input);
  flex1.appendChild(select);

  flex2.appendChild(inputButton);
  flex2.appendChild(randomButton);

  container.appendChild(flex1);
  container.appendChild(flex2);
  container.appendChild(factComp);

  return container;
}

function render() {
  const main = mainComponent();

  app.appendChild(main);
}

render();
