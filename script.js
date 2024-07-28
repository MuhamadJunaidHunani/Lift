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

let currentFloor = floors[floors.length - 1];
const callingFloors = [];
let isLiftMoving = false;

const liftContainer = document.querySelector(".liftContainer");
const leftDoor = document.querySelector(".leftDoor");
const rightDoor = document.querySelector(".rightDoor");
const dailBtn = document.querySelectorAll(".dailBtn");

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
function moveLift(floor, callback) {
    const floorDifference = Math.abs(currentFloor.index - floor.index);

    liftContainer.style.transition = `top ${floorDifference}s linear`;
    liftContainer.style.top = floor.position;

    setTimeout(() => {
        currentFloor = floor;
        setTimeout(()=>{
            leftDoor.style.left = "-50%"
            rightDoor.style.left = "100%"
            setTimeout(() => {
                leftDoor.style.left = "0%"
                rightDoor.style.left = "50%"
                dailBtn[floor.index].classList.remove("selectedBtn");
            }, 2500)
        },1000)
        callback();
    }, floorDifference * 1000);
}
