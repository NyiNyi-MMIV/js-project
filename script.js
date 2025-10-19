//!DOM Selected Variable
const lists = document.querySelectorAll(`.navList`);
const listContainer = document.querySelector(`.navLists`);
const navHome = document.querySelector(`.homeNav`);
const toggleMenu = document.querySelector(`.toggle-menu`);
const menu = document.querySelector(`.menu`);
const closeToogle = document.querySelector(`.close`);
const shopContainer = document.querySelector(`.shop-container`);
const cartLabel = document.querySelector(`.labels`);
const cartTable = document.querySelector(`.cart-container`);
//////////////////////////////////////////////
//!Variables
const protocol = window.location.protocol;
const host = window.location.host;
const filePath = window.location.pathname;
const shopAddress = `${protocol}//${host}/pages/shop`;
const cartAddress = `${protocol}//${host}/pages/cart`;
const homeAddress = `${protocol}//${host}`;

////! Nav And Toogle Menu Start! ////

//!Change localStorage value with Web URL
function unknow(address) {
  if (shopAddress === address) localStorage.setItem("id", 2);
  else if (cartAddress === address) localStorage.setItem("id", 3);
  else {
    localStorage.setItem("id", 1);
  }
}
unknow(window.location.href);
///////////////////////////////////////////

//!EventListener for NAV
listContainer.addEventListener(`click`, function (e) {
  // e.preventDefault();
  const item = e.target.closest(`.navList`);

  if (!item) return;
  lists.forEach((list) => {
    list.classList.remove(`actived`);
  });

  item.classList.add(`actived`);
  //!Change localStorage value with data attribute
  localStorage.setItem("id", item.dataset.id);
});
navHome.addEventListener(`click`, function () {
  lists.forEach((list) => {
    list.classList.remove(`actived`);
  });
  localStorage.setItem(`id`, 1);
});
//! NAV Hover Effect
lists.forEach((list) => {
  list.addEventListener(`mouseover`, function () {
    this.classList.add(`hovered`);
  });
  list.addEventListener(`mouseout`, function () {
    this.classList.remove(`hovered`);
  });
});
/////////////////////////////////////////////////////////

//! Add a class base on localStorage value
const getId = JSON.parse(localStorage.getItem("id"));
lists.forEach((list) => {
  if (list.dataset.id == getId) {
    list.classList.add(`actived`);
  }
});
//////////////////////////////////////////////////////////
//! Rendering side menu for smaller screen
menu.addEventListener(`click`, function (e) {
  toggleMenu.classList.add(`toggle-menu-open`);
});
closeToogle.addEventListener(`click`, function () {
  toggleMenu.classList.remove(`toggle-menu-open`);
});
document.querySelector(`section`).addEventListener(`click`, function (e) {
  toggleMenu.classList.remove(`toggle-menu-open`);
});

////! Nav And Toogle Menu END! ////

////! Shop and Cart Page Start Here!////

class App {
  cartItems = [];
  constructor() {
    this.itemList();
    this.#showItem();
    this.addToCart();
    this.quantityManagement();
  }

  itemList() {
    this.items = [
      {
        id: 1,
        name: `T-Shirt`,
        price: 20,
        img: `/img/compressed/t1-low.png`,
        srcId: `/img/t1.png`,
      },
      {
        id: 2,
        name: `T-shirt`,
        price: 30,
        img: `/img/compressed/t2-low.png`,
        srcId: `/img/t2.png`,
      },
      {
        id: 3,
        name: `Jacket`,
        price: 20,
        img: `/img/compressed/t3-low.png`,
        srcId: `/img/t3.png`,
      },
      {
        id: 4,
        name: ` Shirt`,
        price: 60,
        img: `/img/compressed/t4-low.png`,
        srcId: `/img/t4.png`,
      },
      {
        id: 5,
        name: `Joggers`,
        price: 45,
        img: `/img/compressed/t5-low.png`,
        srcId: `/img/t5.png`,
      },
      {
        id: 6,
        name: `Hoodie`,
        price: 80,
        img: `/img/compressed/t6-low.png`,
        srcId: `/img/t6.png`,
      },
      {
        id: 7,
        name: `Jacket`,
        price: 75,
        img: `/img/compressed/t7-low.png`,
        srcId: `/img/t7.png`,
      },
    ];
  }
  //! Rendering Items for shop page
  #showItem() {
    if (!shopContainer) return;

    this.items.forEach((item) => {
      const html = `<div class="item-contents" data-id="${item.id}">
        <div><img src="${item.img}" alt="" class="imgs" data-src="${item.srcId}" /></div>
        <div class="item-details">
          <div>
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
          </div>
          <button class="btnToCart">Add to cart</button>
        </div>
        </div>`;

      shopContainer.insertAdjacentHTML(`beforeend`, html);
    });
    this.lazyImg();
  }
  //! Add Items to Cart page
  addToCart() {
    const btnToCart = document.querySelectorAll(`.btnToCart`);

    btnToCart.forEach((btn) => {
      btn.addEventListener(`click`, (e) => {
        const itemId = e.target.closest(`.item-contents`).dataset.id;

        //! Getting Date
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const date = new Date();
        const time = new Intl.DateTimeFormat(navigator.language, {
          hour: `2-digit`,
          minute: `2-digit`,
        }).format(date);
        const finalDate = `${daysOfWeek[date.getDay()]} at ${time}`;
        this.items.forEach((item) => {
          item.date = finalDate;
        });
        //! Matching items
        const [jsObj] = this.items.filter((item) => {
          return item.id == itemId;
        });

        //! Check there is the Same item
        const isDuplicate = this.cartItems.some((a) => {
          return a.id == itemId;
        });
        if (isDuplicate) {
          return;
        }

        //! Add to a Array
        this.cartItems.push(jsObj);

        //! Converts js Obj to a JSON String.
        const jsonString = JSON.stringify(this.cartItems);
        //! Add to localStorage
        localStorage.setItem(`addedItems`, jsonString);
      });
    });

    if (!localStorage.getItem(`addedItems`)) {
      return;
    }

    //! Converts JSON String to js obj and Add to a Array
    this.cartItems = JSON.parse(localStorage.getItem(`addedItems`));

    this.renderCarts(this.cartItems);
  }

  //! Render Items in Cart Page
  renderCarts(carts) {
    const isCartExist = document.querySelector(`.isCartExist`);
    if (!cartTable) return;
    //! Hide or Show Labels and Empty Cart Contents
    const isArrayEmpty = () => {
      if (this.cartItems.length === 0) {
        cartLabel.classList.add(`hidden`);
        isCartExist.classList.remove(`hidden`);
      } else {
        cartLabel.classList.remove(`hidden`);
        isCartExist.classList.add(`hidden`);
      }
    };
    isArrayEmpty();
    //! Rendering Items
    carts.forEach((cart, index) => {
      const html = `
      <div class="carts" data-id="${cart.id}">
        <div class="item">
          <div class="img-container">
            <img src="${cart.img}" width="90px" class="imgs"  data-src="${cart.srcId}"   alt="" />
          </div>

          <div class="product-name">
            <h3>${cart.name}</h3>
            <p>${cart.date}</p>
          </div>
        </div>

        <div class="price-div"><p class="item-price">$${cart.price}</p></div>

        <div class="quantity-control">
          <i class="fa-solid fa-plus" data-id="${index}"></i>
          <input
            type="number"
            class="quantity-input"
            value="1"
            min="1"
            max="10"
            data-id="${index}"
            onkeydown="return false"
          />
          <i class="fa-solid fa-minus" data-id="${index}"></i>
          </div>

        <div class="total-div">
          <p class="total-price"  data-id="${index}" >$${cart.price}</p>
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
      `;
      cartTable.insertAdjacentHTML("beforeend", html);
    });
    this.lazyImg();
    //! Removing items from Local Storage, Array and Html
    cartTable.addEventListener("click", (e) => {
      if (!e.target.classList.contains("fa-trash")) return;
      const carts = e.target.closest(".carts");

      if (!carts) return;

      //! update array and storage
      const id = this.cartItems.findIndex(
        (cart) => cart.id == carts.dataset.id
      );
      this.cartItems.splice(id, 1);

      const jsonString = JSON.stringify(this.cartItems);
      localStorage.setItem(`addedItems`, jsonString);

      carts.remove();
      isArrayEmpty();
    });
  }

  quantityManagement() {
    const inputs = document.querySelectorAll(`.quantity-input`);
    const totalPrice = document.querySelectorAll(`.total-price`);

    if (!cartTable) return;

    cartTable.addEventListener(`click`, (e) => {
      const btnsIncrease = e.target.classList.contains(`fa-plus`);
      const btnsDecrease = e.target.classList.contains(`fa-minus`);

      //! Control Input Limit (1 <-to-> 10)
      function inputLimit(min, max, currentValue, target) {
        if (currentValue >= max) {
          target.value = max;
        }
        if (currentValue <= min) {
          target.value = min;
        }
      }

      //! price calculate
      function price(quantity, itemPrice, id) {
        totalPrice.forEach((price) => {
          if (price.dataset.id == id)
            price.textContent = `$${itemPrice * quantity}`;
        });
      }

      // The Main function
      const mainFunc = (id, type) => {
        inputs.forEach((input) => {
          const maxValue = +input.max;
          const minValue = +input.min;
          let inputID = input.dataset.id;
          let inputValue = 1;

          //Input for Increment
          if (id == inputID && type == `increase`) {
            inputValue = +input.value; // convert to NUM
            if (inputValue >= maxValue) return; // guard from exceeding
            input.value = ++inputValue; // assign the value
            inputLimit(minValue, maxValue, inputValue, input);
            const itemPrice = +this.cartItems[id].price; // get the item's price
            price(inputValue, itemPrice, inputID);
          }
          //Input for Decrement
          if (id == inputID && type == `decrease`) {
            inputValue = +input.value;
            if (inputValue <= minValue) return;
            input.value = --inputValue;

            inputLimit(minValue, maxValue, inputValue, input);
            const itemPrice = +this.cartItems[id].price;
            price(inputValue, itemPrice, inputID);
          }
        });
      };

      if (btnsIncrease) {
        const id = e.target.dataset.id;
        const increase = `increase`;
        mainFunc(id, increase);
      }
      if (btnsDecrease) {
        const id = e.target.dataset.id;
        const decrease = `decrease`;
        mainFunc(id, decrease);
      }
    });
  }
  lazyImg() {
    const imgs = document.querySelectorAll(`.imgs`);
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;

          img.addEventListener(`load`, () => {
            img.classList.add(`loaded`);
            obs.unobserve(img);
          });
        });
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );
    imgs.forEach((img) => observer.observe(img));
  }
}
const itemManager = new App();

const btnToCart = document.querySelector(`.btnToCart`);
