// Uses the same styles as Product
import styles from "../Product/Product.module.css";
import img2 from "../../assets/img-2.jpg";
import { PageNavigation } from "../../components/PageNavigation/PageNavigation";

const Pricing = () => {
    const { product, img12 } = styles;
    return (
        <main className={product}>
            <PageNavigation />
            <section>
                <div>
                    <h2>
                        Simple pricing.
                        <br />
                        Just $9/month.
                    </h2>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Vitae vel labore mollitia iusto. Recusandae quos
                        provident, laboriosam fugit voluptatem iste.
                    </p>
                </div>
                <img
                    className={img12}
                    src={img2}
                    alt="overview of a large city with skyscrapers"
                />
            </section>
        </main>
    );
};

export default Pricing;
