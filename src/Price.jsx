export default function Price({price, big=false}){
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price)

    return (
        (big ?
            <h2>{price ? formattedPrice : "FREE"}</h2>
        :
            <p><b>{price ? formattedPrice : "FREE"}</b></p>
        )
    );
}