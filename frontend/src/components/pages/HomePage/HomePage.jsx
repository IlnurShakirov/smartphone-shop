import Header from '@components/UI/Header'
import ProductList from '@components/UI/ProductList'
import AddProduct from '@components/UI/Forms/AddProduct'

import styles from './HomePage.module.css'

const HomePage = ({items, siteData, itemsLoading, itemsError, onAdd, onEdit, onDelete }) => (
  <>
     <Header logo={siteData?.logo} />
    <main className={styles.main}>
      <ProductList
        items={items}
        itemsLoading={itemsLoading}
        itemsError={itemsError}
        onEdit={onEdit}
        onDelete={onDelete}
      />  
    </main>
    <aside className={styles.aside}>
      <AddProduct onAdd={onAdd} />
    </aside>
  </>
)

export default HomePage