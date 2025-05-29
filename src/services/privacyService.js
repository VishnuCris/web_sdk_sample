
export const PrivacyService = {
    showPermissionPrompt(callback) {
        const permissions = ["Location", "SMS", "WhatsApp", "Push Notifications", "Email"];
      
        // Create host container
        const container = document.createElement("div");
        document.body.appendChild(container);
      
        // Attach shadow DOM
        const shadow = container.attachShadow({ mode: "open" });
      
        // Add HTML and CSS inside shadow root
        shadow.innerHTML = `
          <style>
            .nexora-overlay {
              position: fixed;
              top: 0; left: 0;
              width: 100vw; height: 100vh;
              background: rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 100000; /* Very high to avoid being hidden */
            }
            .nexora-modal {
              background: white;
              padding: 20px 30px;
              border-radius: 10px;
              max-width: 400px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              font-family: sans-serif;
            }
            .nexora-modal h3 {
              margin-top: 0;
            }
            .nexora-modal label {
              display: block;
              margin: 8px 0;
            }
            .nexora-buttons {
              margin-top: 20px;
              text-align: right;
            }
            .nexora-button {
              padding: 8px 14px;
              margin-left: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            .nexora-accept-btn {
              background-color: #28a745;
              color: white;
            }
            .nexora-cancel-btn {
              background-color: #ccc;
            }
          </style>
          <div class="nexora-overlay">
            <div class="nexora-modal">
              <h3>Allow Notifications & Access</h3>
              <form id="nexora-permissionForm">
                ${permissions.map(p => `
                  <label>
                    <input type="checkbox" name="permissions" value="${p}">
                    ${p}
                  </label>
                `).join("")}
                <div class="nexora-buttons">
                  <button type="nexora-button" class="nexora-cancel-btn">Cancel</button>
                  <button type="nexora-submit" class="nexora-accept-btn">Accept</button>
                </div>
              </form>
            </div>
          </div>
        `;
      
        const modal = shadow.querySelector(".modal");
      
        // Add event handlers
        shadow.querySelector(".nexora-cancel-btn").addEventListener("click", () => {
          container.remove();
          callback([]);
        });
      
        shadow.querySelector("#nexora-permissionForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const selected = Array.from(shadow.querySelectorAll('input[name="permissions"]:checked'))
                               .map(input => input.value);
          container.remove();
          callback(selected);
        });
      }      
}