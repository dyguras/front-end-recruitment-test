/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if (
    'serviceWorker' in navigator
    && (window.location.protocol === 'https:' || isLocalhost)
  ) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                    'service worker became redundant.');

              default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
  }

  // Your custom JavaScript goes here

  const cloneButton = getButtonByText('Yeah, I want more bacon!');
  const expirationDateInput = document.getElementById('expiration-date');
  const dollars = [...document.querySelectorAll('.dollar')];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const completeButton = document.getElementById('complete-purchase');
  const dialog = document.querySelector('dialog');
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });

  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  if (cloneButton) cloneButton.addEventListener('click', cloneBacon);
  if (expirationDateInput) {
    expirationDateInput.addEventListener('keyup', formatString);
  }
  if (dollars) {
    dollars.map(function(el) {
      el.innerText = formatter.format(el.innerText);
    });
  }
  if (completeButton) {
    completeButton.addEventListener('click', checkForm);
  }

  /**
   * Looks for a button with a specific text
   * @param {string} buttonText Search text.
   * @return {NodeList} Search button.
   */
  function getButtonByText(buttonText) {
    const buttons = [...document.querySelectorAll('button')]
      .filter((el) => (
        el.children.length === 0
        && el.outerText && el.outerText.includes(buttonText)));
    return buttons[0];
  }

  /**
   * Clones the bacon graphics
   */
  function cloneBacon() {
    const baconImage = document.querySelector('img[alt="Bacon"]');
    if (baconImage) {
      baconImage.parentElement.appendChild(baconImage.cloneNode());
    }
  }

  /**
   * Format input string to MM / YY format
   * @param {event} e keyup event handler
   */
  function formatString(e) {
    e.target.value = e.target.value.replace(
      /^([1-9]\ \/|[1-9]\/|[2-9])$/g, '0$1 / ' // 3 > 03 /
    ).replace(
      /^(0[1-9]|1[0-2])$/g, '$1 / ' // 11 > 11 /
    ).replace(
      /^1([3-9])$/g, '01 / $1' // 13 > 01 / 3
    ).replace(
      /^0\/|0+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
      /[^\d|^\/|^\ ]/g, '' // To allow only digits and `/` and space
    ).replace(
      /\/\//g, '/' // Prevent entering more than 1 `/`
    );
  }

  /**
   * Checking form before submit
   * @param {event} e click event handler
   * @return {string} Message
   */
  function checkForm(e) {
    e.preventDefault();
    const form = document.getElementById('checkoutForm');
    for (const el of form.elements) {
      if (el.type !== 'submit' && !el.value) {
        dialog.showModal();
        return;
      }
    }
    form.submit();
    return 'Success - form submited';
  }
})();
