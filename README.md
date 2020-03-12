# Image Transformer Custom Element for Kentico Kontent

This is a custom element similar to the **Asset** element, but it allows you to apply the Image Transformation API to any selected image.

![ElementInAction](https://user-images.githubusercontent.com/34716163/55026851-35778180-4fda-11e9-878f-f790ed4bedb3.gif)

## Setup

1. Deploy the code to a secure public host.
   - See the [Deploying](#Deploying) section for a really quick option.
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
   - The `Hosted code URL` is where you deployed to in step 1.
   - The `Parameters {JSON}` is a JSON object containing optional defaults. See the [JSON parameters](#json-parameters) section for details.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yuriys-kentico/TransformedImagesElement)

## JSON Parameters

All parameters are optional.

`editorDefaultToPreview` is a `boolean` that indicates whether to preview transformations in the editor by default.

`editorDefaultCropType` is a `string` defining the default crop mode. It must be one of the following: "`box`", "`zoom`", "`frame`".

`editorDefaultResizeType` is a `string` defining the default resize mode. It must be one of the following: "`scale`", "`fit`".

`colorPickerDefaultColors` is a `string array` containing the default colors in hexadecimal format, like `["#RRGGBBAA", "#4caf50"]`.

Example JSON parameters object:

```json
{
  "editorDefaultToPreview": true,
  "editorDefaultCropType": "box",
  "colorPickerDefaultColors": ["#34aaffa4", "#4caf50"]
}
```

## Saved Value

The value is a serialized JSON array of objects. Each object has the same shape and contains all of the original asset information as well as information for the transformations.

The `transformedUrl` property contains a URL to the image with the transformations applied. Alternatively, you can construct the transformation using the `transform` property. In that property, check whether any transform value is not `-1`.

Some properties, such as `description` and `title` may be empty or `null` if the image didn't have those values when the item containing the element was saved.

See the [Kentico Kontent documentation](https://docs.kontent.ai/reference/delivery-api#section/Asset-element) for a description of the properties from the original image.

Example deserialized saved value with one image:

```json
[
  {
    "id": "<asset_guid>",
    "description": "<asset_description>",
    "height": 322,
    "width": 500,
    "name": "<asset_name>",
    "title": null,
    "size": 44337,
    "type": "image/jpeg",
    "url": "<asset_base_url>",
    "transforms": {
      "crop": {
        "type": "box",
        "frame": {
          "wFloat": -1,
          "hFloat": -1
        },
        "box": {
          "xFloat": 0.47,
          "yFloat": 0.4969,
          "wFloat": 0.132,
          "hFloat": 0.2329
        },
        "zoom": {
          "xFloat": -1,
          "yFloat": -1,
          "zFloat": -1
        }
      },
      "resize": {
        "type": "fit",
        "scale": {
          "wFloat": -1,
          "hFloat": -1
        },
        "fit": {
          "wFloat": -1,
          "hFloat": -1
        },
        "devicePixelRatio": -1
      },
      "background": {
        "color": {
          "internalRgba": {
            "a": 0,
            "r": 0,
            "g": 0,
            "b": 0
          }
        }
      },
      "format": {
        "format": "JPG",
        "autoWebp": false,
        "lossless": null,
        "quality": 50
      }
    },
    "transformedUrl": "<asset_base_url>?rect=235,160,66,75&fm=jpg&q=50"
  }
]
```
