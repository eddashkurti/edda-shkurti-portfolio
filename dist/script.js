const copyButton = document.querySelector("#copyEmail");
const copyStatus = document.querySelector("#copyStatus");
const email = "hello@example.com";

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied.";
  } catch {
    copyStatus.textContent = email;
  }
});
