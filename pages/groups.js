import Link from "next/Link";
import Header from "../components/Header";

export default function groups () {
    let testNum = String(1234)
    let newGroupId = "/group/" + testNum
    let testArray = [
        [{name: "ryan", number: 3}, true],
        [{name: "yanr", number: 5}, false],
        [{name: "noah", number: 7}, true]
    ]

    return (
        <div>
            <Header />

            <Link href= {newGroupId} className="link"><a>Groups</a></Link><br/>
            <button type = "submit" id = "test" onClick = {
                () => {
                    console.log(testArray[0][1])
                }
            }>Click for array</button>
            {
                testArray.map((test) => (
                    <p>{test[0].name}</p>
                ))
            }
        </div>
    )
}