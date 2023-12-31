class ColoredPetriNet {
    constructor(places, transitions) {
        this.places = places;
        this.transitions = transitions;
        this.stepCounter = 0;
    }
    showStep(currentTransition) {
        console.log("Step №" + this.stepCounter);

        for (const index in this.places) {
            this.places[index].show(index);
        }
        console.log(currentTransition);
        console.log(currentTransition);
    }
    run() {
        const currentTransition = this.getTransition(this.transitions, this.places);
        if (currentTransition !== null && this.stepCounter<40) {
            this.showStep(currentTransition);

            this.stepCounter++;
            this.doTransition(currentTransition);
            this.run()
        } else {
            this.showStep(currentTransition);

        }


    }
    getTransition(transitions, places) {
        const foundTransition = transitions.find(transition => {
            const currentColor = transition.color;
            let check = true;
            transition.holdingOut.forEach(holdingOut => {
                const amountToCompare = this.getAmountToCompare(holdingOut.place, currentColor);
                if (amountToCompare === undefined || amountToCompare - holdingOut.amount < 0) {
                    check = false;
                }
            });
            return check;
        });

        if (foundTransition) {
            return foundTransition;
        } else {
            return null;
        }
    }


    getAmountToCompare(place, colorToCompare) {
        const foundElement = this.places[place].points.find(element => element.color === colorToCompare);

        if (foundElement) {
            return foundElement.holding;
        }

        return undefined;
    }

    doTransition(transition) {
        transition.holdingIn.map(element => element.add(element, transition.color, this.places))
        transition.holdingOut.map(element => element.remove(element, transition.color, this.places))
    }
}

class Place {
    //:Points[]
    constructor(points = []) {
        this.points = points
    }
    show(placeIndex) {
        console.log(`Points in place №${placeIndex}:`);
        for (const index in this.points) {
            const point = this.points[index];
            console.log(`[${index}] Holding: ${point.holding}, Color: ${point.color} `);
        }

    }
}

class Points {
    constructor(holding, color = "white") {
        this.holding = holding;
        this.color = color;
    }
}

class Transition {
    constructor(holdingOut, holdingIn, color = "white") {
        this.holdingOut = holdingOut;
        this.holdingIn = holdingIn;
        this.color = color;
    }
}

class ArcBase {
    constructor(amount, place) {
        this.amount = amount;
        this.place = place;
    }
}

class In extends ArcBase {
    add(elementToAdd, color, places) {
        const { place } = elementToAdd;
        const points = places[place].points;

        const matchingElement = points.find(element => element.color === color);

        if (matchingElement) {
            matchingElement.holding += elementToAdd.amount;
        } else {

            points.push(new Points(elementToAdd.amount, color));
        }
    }

}

class Out extends ArcBase {
    remove(elementToRemove, color, places) {
        const { place } = elementToRemove;
        const points = places[place].points;

        const matchingElement = points.find(element => element.color === color);

        if (matchingElement) {
            matchingElement.holding -= elementToRemove.amount;
        } else {
            console.log(`Element with color ${color} does not exist in ${place}`);
        }
    }

}

function main() {
    const placeArr = [
        new Place([new Points(2, "red"), new Points(2, "blue")]),
        new Place([new Points(4, "red"), new Points(5, "blue")]),
        new Place([]),
        new Place([])
    ]
    const transitionArr = [
        new Transition(
            [new Out(1, 0), new Out(1, 1)],
            [new In(2, 2)],
            "red"
        ),
        new Transition(
            [new Out(1, 1)],
            [new In(2, 2)],
            "blue"
        ),
        new Transition(
            [new Out(1, 1)],
            [new In(2, 2), new In(1, 0)],
            "red"
        ),
    ]

    // const placeArr = [
    //     new Place([new Points(1, "red"), new Points(1, "blue"), new Points(0, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(0, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(0, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(1, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(0, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(0, "green")]),
    //     new Place([new Points(0, "red"), new Points(0, "blue"), new Points(0, "green")]),
    // ]
    // const transitionArr = [
    //     new Transition(
    //         [new Out(1, 0)],
    //         [new In(1, 1)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 4)],
    //         [new In(1, 6), new In(1, 0)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(6, 4)],
    //         [new In(1, 0)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 1)],
    //         [new In(1, 2)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 2)],
    //         [new In(1, 3)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 3)],
    //         [new In(1, 4)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 4)],
    //         [new In(1, 5)],
    //         "red"
    //     ),
    //     new Transition(
    //         [new Out(1, 7)],
    //         [new In(2, 8)],
    //         "blue"
    //     ),
    // ]

    // console.log(transitionArr);

    // console.log(placeArr);

    const coloredPetriNet = new ColoredPetriNet(placeArr, transitionArr);
    console.log(coloredPetriNet)

    coloredPetriNet.run();
    console.log(coloredPetriNet)

}

main();