import { 
  Countdown, Instant, 
  TimeRangeConditional, Vault, Program, 
  Conditional, ConditionalTag, Duration, 
  UptimeAllowanceConditional, CountdownConditional, 
} from "./x.ts";

const styles = `
/* Modern CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
  color: #333;
}

/* Main container */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header stats cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.stat-card h2 {
  color: #667eea;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

/* Section headers */
.section-header {
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid rgba(255, 255, 255, 0.3);
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.section-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

/* Conditionals grid */
.conditionals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.conditional-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.conditional-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.conditional-card p {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Vaults grid */
.vaults-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.vault-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.vault-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.vault-card p {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.vault-card button {
  margin-top: 1rem;
  width: 100%;
  background: #667eea;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.vault-card button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.vault-card button a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  display: block;
}

/* Forms grid */
.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.form-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-card:hover {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.form-card fieldset {
  border: none;
  padding: 0;
}

.form-card legend {
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  width: 100%;
}

.form-card label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #4a5568;
}

.form-card input[type="number"],
.form-card input[type="text"],
.form-card select,
.form-card textarea {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8f9fa;
}

.form-card input:focus,
.form-card select:focus,
.form-card textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-card textarea {
  resize: vertical;
  min-height: 100px;
}

.form-card button[type="submit"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.form-card button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%);
}

/* Utility classes */
.mt-4 {
  margin-top: 2rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  body {
    padding: 1rem;
  }
  
  .forms-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
`;

const Countdown_toHtml = (it: Countdown, now: Instant) => {
  return it.match(now, {
    Pending(it) {
      const start = it.getTimeTillStartOrZero(now).toString2();
      const duration = it.getTotalDuration().toString2();
      return `Will start in ${start} and lasts for ${duration}`;
    },
    Running(it) {
      const start = it.getTimeSinceStartOrZero(now).toString2();
      const duration = it.getTimeTillFinishOrZero(now).toString2();
      return `Started ${start} ago and will last for ${duration}`;
    },
    Finished(it) {
      const start = it.getTimeSinceStartOrZero(now);
      const duration = it.getTotalDuration().toString2();
      return `Started ${start} ago and lasted ${duration}`;
    },
  });
};

const TimeRangeConditional_toHtml = (it: TimeRangeConditional, now: Instant) => {
  const timeRange = it.timeRange.toString();
  const lifetime = Countdown_toHtml(it.lifetime, now);

  return `
    <div>
      <p>Time range: ${timeRange}</p>
      <p>Lifetime: ${lifetime}</p>
    </div>
  `;
};

const CountdownConditional_toHtml = (it: CountdownConditional, now: Instant) => {
  return `
    <div>
      <p>Countdown: ${Countdown_toHtml(it.countdown, now)}</p>
    </div>
  `;
};

const UptimeAllowanceConditional_toHtml = (
  it: UptimeAllowanceConditional, 
  dailyUptime: Duration,
  now: Instant,
) => {
  return `
    <div>
      <p>Total allowance: ${it.getTotalAllowance().toString2()}</p>
      <p>Remaining allowance: ${it.getRemainingAllowance(dailyUptime).toString2()}</p>
      <p>Lifetime: ${Countdown_toHtml(it.getLifetime(), now)}</p>
    </div>
  `;
};

const Conditional_toHtml = (it: Conditional, program: Program) => {
  switch (it.tag) {
    case ConditionalTag.UptimeAllowance: {
      return UptimeAllowanceConditional_toHtml(
        it, 
        program.uptimeClock.getDailyUptime(),
        program.monotonicClock.getNow(),
      );
    }
    case ConditionalTag.Countdown: {
      return CountdownConditional_toHtml(
        it,
        program.monotonicClock.getNow(),
      );
    }
    case ConditionalTag.TimeRange: {
      return TimeRangeConditional_toHtml(
        it,
        program.monotonicClock.getNow(),
      );
    }
  }
};

const Vault_toHtml = (it: Vault, program: Program) => {
  const now = program.monotonicClock.getNow();

  const url = new URL("/prolong-vault-protection", program.serverAddress);
  url.searchParams.set("name", it.getName().toString());

  let data: string;
  if (it.isProtected(program.monotonicClock.getNow())) {
    data = `<p>Data is protected</p>`;
  } else {
    data = `<p>Data: ${it.getData().toString()}</p>`;
  }

  return `
    <div>
      <p>Name: ${it.getName().toString()}</p>
     
      ${data}
      
      <p>
        Protection: ${Countdown_toHtml(it.getProtection(), now)}
      </p>
      
      <button type="button">
        <a href="${url.toString()}">
          ${it.isProtected(now) ? "Increment Protection" : "Protect"}
        </a>
      </button>
    </div>
  `;
};

const createTimeRangeConditionalForm = `
  <form action="/create-time-range-conditional" method="get">
    <fieldset>
      <legend>Create Time Range Conditional</legend>
      
      <label>
        From hour:
        <input type="number" name="from-hour" min="0" max="23" value="0" required>
      </label>
      <br>
      
      <label>
        From minute:
        <input type="number" name="from-minute" min="0" max="59" value="0" required>
      </label>
      <br>
      
      <label>
        Till hour:
        <input type="number" name="till-hour" min="0" max="23" value="0" required>
      </label>
      <br>
      
      <label>
        Till minute:
        <input type="number" name="till-minute" min="0" max="59" value="0" required>
      </label>
      <br>
      
      <label>
        Lifetime (in minutes):
        <input type="number" name="lifetime" min="1" max="10080" value="60" required>
      </label>
      <br>
      
      <label>
        Location:
        <select name="location" required>
          <option value="" disabled selected>Pwease select a location</option>
          <option value="ruru-screen">Ruru screen</option>
          <option value="ruru-internet">Ruru internet</option>
          <option value="luny-screen">Luny screen</option>
          <option value="luny-internet">Luny internet</option>
        </select>
      </label>
      <br>

      <button type="submit">Create</button>
    </fieldset>
  </form>
`;

const createCountdownConditionalForm = `
  <form action="/create-countdown-conditional" method="get">
    <fieldset>
      <legend>Create Countdown Conditional</legend>
      
      <label>
        Duration (in minutes):
        <input type="number" name="duration" min="1" max="10080" value="60" required>
      </label>
      <br>
      
      <label>
        Location:
        <select name="location" required>
          <option value="" disabled selected>Pwease select a location</option>
          <option value="ruru-screen">Ruru screen</option>
          <option value="ruru-internet">Ruru internet</option>
          <option value="luny-screen">Luny screen</option>
          <option value="luny-internet">Luny internet</option>
        </select>
      </label>
      <br>
      
      <button type="submit">Create</button>
    </fieldset>
  </form>
`;

const createUptimeAllowanceConditionalForm = `
  <form action="/create-uptime-allowance-conditional" method="get">
    <fieldset>
      <legend>Create Daily Uptime Allowance Conditional</legend>
      
      <label>
        Lifetime (in minutes): 
        <input type="number" name="lifetime" min="1" max="10080" value="60" required>
      </label>
      <br>
      
      <label>
        Allowance (in minutes):
        <input type="number" name="allowance" min="1" max="10080" value="30" required>
      </label>
      <br>
      
      <label>
        Location:
        <select name="location" required>
          <option value="" disabled selected>Pwease select a location</option>
          <option value="ruru-screen">Ruru screen</option>
          <option value="ruru-internet">Ruru internet</option>
          <option value="luny-screen">Luny screen</option>
          <option value="luny-internet">Luny internet</option>
        </select>
      </label>
      <br>
      
      <button type="submit">Create</button>
    </fieldset>
  </form>
`;

const createVaultForm = `
  <form action="/create-vault" method="get">
    <fieldset>
      <legend>Create Vault</legend>
      
      <label>
        Name:
        <input type="text" name="name" maxlength="300" placeholder="Enter vault name" required>
      </label>
      <br>
      
      <label>
        Data:
        <textarea name="data" maxlength="500" rows="4" cols="50" placeholder="Enter vault data" required></textarea>
      </label>
      <br>
      
      <label>
        Protection duration (in minutes):
        <input type="number" name="protection-duration" min="1" max="10080" value="60" required>
      </label>
      <br>
      
      <button type="submit">Create</button>
    </fieldset>
  </form>
`;

// export const Program_toHtml = (program: Program) => {
//   const uptime = program
//     .uptimeClock
//     .getDailyUptime()
//     .toString2();

//   const datetime = program
//     .monotonicClock
//     .getNowAsDateTime()
//     .toString();

//   const lunyScreenConditionals = program
//     .luny
//     .screen
//     .map(it => Conditional_toHtml(it, program))
//     .join("\n");

//   const lunyInternetConditionals = program
//     .luny
//     .internet
//     .map(it => Conditional_toHtml(it, program))
//     .join("\n");

//   const ruruScreenConditionals = program
//     .ruru
//     .screen
//     .map(it => Conditional_toHtml(it, program))
//     .join("\n");

//   const ruruInternetConditionals = program
//     .ruru
//     .internet
//     .map(it => Conditional_toHtml(it, program))
//     .join("\n");

//   const vaults = program
//     .vaults
//     .map(it => Vault_toHtml(it, program))
//     .join("\n");
  
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Document</title>
//     </head>
//     <body>
//       <h1>Uptime: ${uptime}</h1>
      
//       <h1>Date time: ${datetime}</h1>

//       <h1>Luny screen conditionals</h1>
//       <div>
//         ${lunyScreenConditionals}
//       </div>

//       <h1>Luny internet conditionals</h1>
//       <div>
//         ${lunyInternetConditionals}
//       </div>


//       <h1>Ruru screen conditionals</h1>
//       <div>
//         ${ruruScreenConditionals}
//       </div>
      
//       <h1>Ruru internet conditionals</h1>
//       <div>
//         ${ruruInternetConditionals}
//       </div>

//       <h1>Vaults</h1>
//       <div>
//         ${vaults}
//       </div>

//       ${createVaultForm}
//       ${createCountdownConditionalForm}
//       ${createTimeRangeConditionalForm}
//       ${createUptimeAllowanceConditionalForm}
//     </body>
//     </html>
//   `;
// };

export const Program_toHtml = (program: Program) => {
  const uptime = program
    .uptimeClock
    .getDailyUptime()
    .toString2();

  const datetime = program
    .monotonicClock
    .getNowAsDateTime()
    .toString2();

  const lunyScreenConditionals = program
    .luny
    .screen
    .map(it => `<div class="conditional-card">${Conditional_toHtml(it, program)}</div>`)
    .join("\n");

  const lunyInternetConditionals = program
    .luny
    .internet
    .map(it => `<div class="conditional-card">${Conditional_toHtml(it, program)}</div>`)
    .join("\n");

  const ruruScreenConditionals = program
    .ruru
    .screen
    .map(it => `<div class="conditional-card">${Conditional_toHtml(it, program)}</div>`)
    .join("\n");

  const ruruInternetConditionals = program
    .ruru
    .internet
    .map(it => `<div class="conditional-card">${Conditional_toHtml(it, program)}</div>`)
    .join("\n");

  const vaults = program
    .vaults
    .map(it => `<div class="vault-card">${Vault_toHtml(it, program)}</div>`)
    .join("\n");
  
    // <link rel="stylesheet" href="styles.css">
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Program Dashboard</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <h2>Today's Uptime</h2>
            <p>${uptime}</p>
          </div>
          <div class="stat-card">
            <h2>Current Time</h2>
            <p>${datetime}</p>
          </div>
        </div>

        <div class="section-header">
          <h1>📍 Luny Screen Conditionals</h1>
        </div>
        <div class="conditionals-grid">
          ${lunyScreenConditionals || '<p class="stat-card">No conditionals</p>'}
        </div>

        <div class="section-header">
          <h1>🌐 Luny Internet Conditionals</h1>
        </div>
        <div class="conditionals-grid">
          ${lunyInternetConditionals || '<p class="stat-card">No conditionals</p>'}
        </div>

        <div class="section-header">
          <h1>📍 Ruru Screen Conditionals</h1>
        </div>
        <div class="conditionals-grid">
          ${ruruScreenConditionals || '<p class="stat-card">No conditionals</p>'}
        </div>

        <div class="section-header">
          <h1>🌐 Ruru Internet Conditionals</h1>
        </div>
        <div class="conditionals-grid">
          ${ruruInternetConditionals || '<p class="stat-card">No conditionals</p>'}
        </div>

        <div class="section-header">
          <h1>🔒 Vaults</h1>
        </div>
        <div class="vaults-grid">
          ${vaults || '<p class="stat-card">No vaults</p>'}
        </div>

        <div class="section-header">
          <h1>➕ Create New</h1>
        </div>
        <div class="forms-grid">
          <div class="form-card">
            ${createVaultForm}
          </div>
          <div class="form-card">
            ${createCountdownConditionalForm}
          </div>
          <div class="form-card">
            ${createTimeRangeConditionalForm}
          </div>
          <div class="form-card">
            ${createUptimeAllowanceConditionalForm}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};