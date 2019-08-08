import { Stack, Thumbnail } from '@shopify/polaris';
import React from 'react';
import { uid } from 'react-uid';
import SectionTitle from './section-title';

const ImageGrid = ({ title, limit, images }) => {
    return (
        <React.Fragment>
            {title &&
                <SectionTitle>{title}</SectionTitle>
            }
            <Stack alignment="center" distribution="leading" spacing="loose">
                {images &&
                    images.map((image, i) => {
                        const isString = typeof image === 'string';
                        const hover = isString ? title : (image.alt || title);

                        return (i < limit &&
                            <Thumbnail
                                key={uid(image, i)}
                                size="large"
                                source={isString ? image : image.src}
                                title={hover}
                                alt={hover} />
                        )
                    })
                }
            </Stack>
        </React.Fragment>
    );
};

export default ImageGrid;