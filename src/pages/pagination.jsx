import axios from "axios"
import { useEffect, useRef, useState } from "react"

export default function Pagination() {
    const [list, setList] = useState();
    const [count, setCount] = useState(10);
    const [page, setPage] = useState(1);
    const [totalLength, setTotalLength] = useState();
    const [pageArray, setPageArray] = useState([]);
    const listInnerRef = useRef();

    useEffect(() => async () => {
        try {
            let res = await axios({
                url: `https://192.168.1.223:7198/getData?count=${count}&&page=${page}`,
                method: 'GET',
            })
            console.log(res)
            setList(res.data.list)
            setTotalLength(res.data.totalCount)
            MakePagearray(res.data.totalCount)
        } catch (error) {
            console.log(error)
        }
    }, [])

    async function changePage(page) {
        try {
            let res = await axios({
                url: `https://192.168.1.223:7198/getData?count=${count}&&page=${page}`,
                method: 'GET',
            })
            console.log(res)
            setList(res.data.list)
        } catch (error) {
            console.log(error)
        }
    }

    function MakePagearray(totalCount) {
        for (let i = 1; i <= Math.ceil(totalCount / count); i++) {
            setPageArray((state) => [...state, { page: i }])
        }
    }

    const onScroll = async () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            // console.log(scrollTop, clientHeight, scrollHeight)
            if (scrollTop + clientHeight === scrollHeight) {
                setPage((state) => state + 1)
                try {
                    let res = await axios({
                        url: `https://192.168.1.223:7198/getData?count=${count}&&page=${page+1}`,
                        method: 'GET',
                    })
                    console.log(res)
                    setList((state) => [...state, ...res.data.list])
                } catch (error) {
                    console.log(error)
                }
            }
        }
    };

    // console.log(window.innerHeight)
    return (
        <>
            <div onScroll={() => { onScroll() }} ref={listInnerRef} style={{height:'400px', overflowY: "scroll"}}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>userName</th>
                            <th>firstName</th>
                            <th>lastName</th>
                            <th>gender</th>
                            <th>password</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list?.map((data) => {
                            return (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.userName}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.gender}</td>
                                    <td>{data.password}</td>
                                    <td>{data.status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {/* <div style={{ display: 'flex' }}>
                <button disabled={page <= 1} onClick={() => { setPage((state) => state - 1); changePage(page - 1) }}>Previous</button>
                {pageArray.map((data) => {
                    return (
                        <button style={{ color: `${page === data.page ? 'red' : 'black'}` }} onClick={() => { setPage(data.page); changePage(data.page) }}>{data.page}</button>
                    )
                })}
                <button disabled={page === (totalLength / count)} onClick={() => { setPage((state) => state + 1); changePage(page + 1) }}>Next</button>
            </div> */}
        </>
    )
}