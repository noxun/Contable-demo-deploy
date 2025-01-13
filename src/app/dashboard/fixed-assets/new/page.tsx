import { FormFixedAssets } from '@/modules/fixed-assets/components/FormFixedAssets'

export default function NewFixedAssetPage() {

  return (
    <>
      <section className='px-5 mx-auto'>
        <h3 className='text-xl pb-4 text-center'>Registrar un nuevo activo fijo</h3>
        <FormFixedAssets />
      </section>

    </>
  )
}
