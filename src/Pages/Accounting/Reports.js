import React, { useEffect } from 'react';

const Reports = (props) => {

    useEffect(() => {
        //console.log(props.orders[0]);

    }, [props.orders[0]])

    return (
        <>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Cost Of Goods</th>
                        <th scope="col">Purchase Marketplace Id</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Price Subtotal</th>
                        <th scope="col">Delivery Cost</th>
                        <th scope="col">Tax</th>
                        <th scope="col">Total</th>
                        <th scope="col">Total Marketplace Fee</th>
                        <th scope="col">Total Due Seller</th>
                        <th scope="col">Profit or Loss</th>
                    </tr>
                </thead>
                <tbody>
                    {props.orders.map((order, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{order.orderId}</td>
                                <td>{order.title}</td>
                                <td>{<input size="8"
                                    style={{ border: 'none', padding: '5px 5px' }}
                                    value={order.costOfGoods ? order.costOfGoods : ''} 
                                    onChange={(e) => props.updateCostOfGoods(index, order.orderId, e.target.value)}/>}
                                </td>
                                <td>{order.purchaseMarketplaceId}</td>
                                <td>{order.orderPaymentStatus}</td>
                                <td>{order.priceSubtotal}</td>
                                <td>{order.deliveryCost}</td>
                                <td>{order.tax}</td>
                                <td>{order.total}</td>
                                <td>{order.totalMarketplaceFee}</td>
                                <td>{order.totalDueSeller}</td>
                                {order.costOfGoods ?
                                    parseInt(order.totalDueSeller) - parseInt(order.costOfGoods) > 0 ?
                                        <td style={{ color: '#16DB93', fontStyle: 'bold' }}>{parseInt(order.totalDueSeller) - parseInt(order.costOfGoods)}</td> :
                                        <td style={{ color: '#EF3E36', fontStyle: 'bold' }}>{parseInt(order.totalDueSeller) - parseInt(order.costOfGoods)}</td> :
                                    <td></td>}
                            </tr>)
                    })}

                </tbody>
            </table>
            <div style={{ width: '100%' }}>
                {props.isReportsDataLoading ?
                    (<div className="d-flex justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>) : null}
            </div>
        </>
    );
}

export default Reports;