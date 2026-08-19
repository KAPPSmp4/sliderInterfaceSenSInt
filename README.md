# Minimal slider experiment

## Run
1. Install Node.js 18+.
2. In this folder run: `npm install`
3. Run: `npm start`
4. Participant computer: open `http://SERVER-IP:3000/participant.html`
5. Experimenter computer: open `http://SERVER-IP:3000/experimenter.html`

Both computers must be able to reach the computer running Node.js on port 3000.

Data is appended to `data/experiment.csv` and can also be downloaded from the experimenter page.

The CSV records participant ID, Unix timestamp in milliseconds, normalized position (0–1), speed in slider-units/second, direction, and event type.
