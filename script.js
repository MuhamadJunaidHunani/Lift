const floors = [
    {
        floor: "3",
        index: 0,
        position: '0%',
    },
    {
        floor: "2",
        index: 1,
        position: '25%',
    },
    {
        floor: "1",
        index: 2,
        position: '50%',
    },
    {
        floor: "G",
        index: 3,
        position: '75%',
    },
];

const liftContainer = document.querySelector(".liftContainer");
const leftDoor = document.querySelector(".leftDoor");
const rightDoor = document.querySelector(".rightDoor");
const dailBtn = document.querySelectorAll(".dailBtn");
const floorContainer = document.querySelectorAll(".floors");
const alarm = document.querySelector(".alarm");
const movingAudio = document.querySelector(".movingAudio");
const openingAudio = document.querySelector(".openingAudio");
const reachingAudio = document.querySelector(".reachingAudio");


let currentFloor = floors[floors.length - 1];
let callingFloors = [];
let isLiftMoving = false;
let direction = false;
let doesContain = false;

floorContainer.forEach((locationPlate) => {
    locationPlate.innerHTML = `
        <div class="locationPlate">
            <i class="fa-solid fa-caret-down upIcon"></i>
            <p class="floorNo">${currentFloor.floor}</p>
            <i class="fa-solid fa-caret-up downIcon"></i>
        </div>`;
});

dailBtn.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
        if (!e.target.classList.contains("selectedBtn")) {
            e.target.classList.add("selectedBtn");
            callingFloors.push(floors[index]);
            setInLine();
        }
    });
});

function setInLine() {
    if (isLiftMoving || callingFloors.length === 0) {
        return
    };

    isLiftMoving = true;
    moveLift(callingFloors.shift(), () => {
        setTimeout(() => {
            isLiftMoving = false;
            setInLine();
        }, 6000);
    });
}
const moveLift = (floor, callback) => {
    movingAudio.play();
    const floorDifference = Math.abs(currentFloor.index - floor.index);
    direction = currentFloor.index > floor.index ? "up" : "down";
    floorContainer.forEach((locationPlate) => {
        locationPlate.innerHTML = `
            <div class="locationPlate">
                <i class="fa-solid fa-caret-down upIcon ${direction === "down" ? "active" : ''}"></i>
                <p class="floorNo">${currentFloor.floor}</p>
                <i class="fa-solid fa-caret-up downIcon ${direction === "up" ? "active" : ''}"></i>
            </div>`;
    });

    let tempIndex = currentFloor.index;
    const intervalId = setInterval(() => {

        if (floor.index < currentFloor.index) {
            tempIndex--;
            currentFloor = floors[tempIndex]
        }
        else if (floor.index > currentFloor.index) {
            tempIndex++;
            currentFloor = floors[tempIndex]
        }
        else {
            clearInterval(intervalId);
            return
        }
        if (callingFloors.includes(currentFloor)) {
            let temp = callingFloors.splice(callingFloors.indexOf(currentFloor), 1)[0];
            callingFloors.unshift(floor);
            callingFloors.unshift(temp);
            doesContain = true;
            liftContainer.style.transition = `top ${floorDifference}s linear`;
            liftContainer.style.top = floor.position;
            clearInterval(intervalId);
            clearInterval(intervalId2);
            moveLift(callingFloors.shift(), () => {
                setTimeout(() => {
                    isLiftMoving = false;
                    setInLine();
                }, 6000);
            });
            return;
        }
        document.querySelectorAll(".floorNo").forEach((no) => {
            no.innerHTML = currentFloor.floor
        })

    }, 1000);
    liftContainer.style.transition = `top ${floorDifference}s linear`;
    liftContainer.style.top = floor.position;

      const intervalId2 = setTimeout(() => {
          setTimeout(() => {
            movingAudio.pause();
            reachingAudio.play();
            openingAudio.play();
            leftDoor.style.left = "-50%"
            rightDoor.style.left = "100%"
            setTimeout(() => {
                leftDoor.style.left = "0%"
                rightDoor.style.left = "50%"
                console.log(floor.floor);
                dailBtn[floor.index].classList.remove("selectedBtn");
            }, 2500)
        }, 1000)
        callback();
    }, floorDifference * 1000);
}