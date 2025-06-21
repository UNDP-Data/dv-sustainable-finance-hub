import { MarkdownRenderer } from '@undp/design-system-react';

import { DataType } from './types';
interface Props {
  data: DataType;
}

function ModalContent(props: Props) {
  const { data } = props;
  return (
    <div>
      <p className='text-xl mt-0 pb-4'>{data.country}</p>
      <table className='modal-table w-full'>
        <thead>
          <tr>
            <th className='text-sm uppercase font-bold text-left'>
              SERVICES/WORK AREAS
            </th>
            <th className='text-sm uppercase font-bold text-left'>
              SUBCATEGORIES
            </th>
            <th className='text-sm uppercase font-bold text-left w-1/3'>
              NOTES
            </th>
          </tr>
        </thead>
        <tbody>
          {data.private ? (
            <tr>
              <td>
                <div className='chip private-chip'>Private</div>
              </td>
              <td>
                {data.private_impact && (
                  <div className='chip chip-sub private-chip-sub'>
                    Managing for impact
                  </div>
                )}
                {data.private_pipelines && (
                  <div className='chip chip-sub private-chip-sub'>
                    Originating pipelines
                  </div>
                )}
                {data.private_environment && (
                  <div className='chip chip-sub private-chip-sub'>
                    Enabling environment
                  </div>
                )}
              </td>
              <td className='w-1/3'>
                <MarkdownRenderer
                  text={data.private_note}
                  classNames={{ li: 'mb-1', ol: 'mb-1', p: 'mb-3' }}
                />
              </td>
            </tr>
          ) : null}
          {data.public ? (
            <tr>
              <td>
                <div className='chip public-chip'>Public</div>
              </td>
              <td>
                {data.public_tax && (
                  <div className='chip chip-sub public-chip-sub'>
                    Tax for the SDGs
                  </div>
                )}
                {data.public_debt && (
                  <div className='chip chip-sub public-chip-sub'>
                    Debt for the SDGs
                  </div>
                )}
                {data.public_budget && (
                  <div className='chip chip-sub public-chip-sub'>
                    Budget for the SDGs
                  </div>
                )}
                {data.public_insurance && (
                  <div className='chip chip-sub public-chip-sub'>
                    Insurance and risk finance
                  </div>
                )}
              </td>
              <td className='w-1/3'>
                <MarkdownRenderer
                  text={data.public_note}
                  classNames={{ li: 'mb-1', ol: 'mb-1', p: 'mb-3' }}
                />
              </td>
            </tr>
          ) : null}
          {data.inffs ? (
            <tr>
              <td>
                <div className='chip inffs-chip'>INFFs</div>
              </td>
              <td />
              <td className='w-1/3'>
                <MarkdownRenderer
                  text={data.inffs_note}
                  classNames={{ li: 'mb-1', ol: 'mb-1', p: 'mb-3' }}
                />
              </td>
            </tr>
          ) : null}
          {data.biofin ? (
            <tr>
              <td>
                <div className='chip biofin-chip'>Biodiversity</div>
              </td>
              <td />
              <td className='w-1/3'>
                <MarkdownRenderer
                  text={data.biofin_note}
                  classNames={{ li: 'mb-1', ol: 'mb-1', p: 'mb-3' }}
                />
              </td>
            </tr>
          ) : null}
          {data.climate_finance ? (
            <tr>
              <td>
                <div className='chip climate-finance-chip'>Climate</div>
              </td>
              <td />
              <td className='w-1/3'>
                <MarkdownRenderer
                  text={data.climate_finance_note}
                  classNames={{ li: 'mb-1', ol: 'mb-1', p: 'mb-3' }}
                />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default ModalContent;
