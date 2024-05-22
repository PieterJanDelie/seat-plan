document.addEventListener("DOMContentLoaded", (event) => {
  const barcodeInput = document.getElementById("barcodeInput");
  const seatImage = document.getElementById("seatImage");
  const defaultImageSrc = "Photos/plan-default.jpg";
  var scannedImageSrc = "Photos/plan-default.jpg";

  barcodeInput.addEventListener("input", async (event) => {
    const barcode = barcodeInput.value.trim();
    const serverIp = "192.168.56.1";

    if (barcode) {
      try {
        const response = await fetch(
          `http://${serverIp}:3000/seatCoordinates?barcode=${barcode}`
        );
        const data = await response.json();

        console.log(data);
        var item = {
          seat: {
            section: "A",
            row: 17,
            seat: 1705,
          },
        };
        var json = {
          Blocks: [
            {
              BlockName: "A",
              Positions: [
                { Seat: "701", position: { Top: 43.4, Left: 12.7 } },
                { Seat: "703", position: { Top: 43.4, Left: 14.1 } },
              ],
            }
            ],
        };
        var blockName = item.seat.section;
        scannedImageSrc = "Photos/plan-" + blockName + ".jpg";
        var seatNumber = item.seat.seat;
        var block = json.Blocks.find((block) => block.BlockName === blockName);
        console.log("Ticket", item);
        console.log("Block", block);

        if (block) {
          var seat = block.Positions.find(
            (position) => position.Seat == seatNumber
          );

          if (seat) {
            console.log("Top:", seat.position.Top);
            console.log("Left:", seat.position.Left);
            var circle = document.getElementById("circle");
            circle.style.top = "calc(" + seat.position.Top + "% - 5px)";
            circle.style.left = "calc(" + seat.position.Left + "% - 5px)";
            circle.style.display="block"
          } else {
            console.log("Zitplaats niet gevonden in het block:", blockName);
          }
        } else {
          console.log("Block niet gevonden:", blockName);
        }
        seatImage.src = scannedImageSrc;

        setTimeout(() => {
          var circle = document.getElementById("circle");
          circle.style.display = "none"
          seatImage.src = defaultImageSrc;
        }, 5000);
      } catch (error) {
        console.error("Error fetching seat coordinates:", error);
      }
    }

    barcodeInput.value = "";
  });
});
