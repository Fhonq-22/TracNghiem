import { PROJECT } from "../Config/PROJECT.config.js";

document.querySelectorAll(".projectName").forEach(e => {
    e.innerText = PROJECT;
});