# Image Transformer Custom Element for Kentico Kontent

This is a custom element similar to the **Asset** element, but it allows you to apply the Image Transformation API to any selected image.

![ElementInAction](https://user-images.githubusercontent.com/34716163/55026851-35778180-4fda-11e9-878f-f790ed4bedb3.gif)

## Setup

1. Deploy the code to a secure public host
    * See [deploying section](#Deploying) for a really quick option
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
    * The `Hosted code URL` is where you deployed to in step 1
    * Pass the necessary parameters as directing in the [JSON Parameters configuration](#json-parameters) section of this readme.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yuriys-kentico/TransformedImagesElement)

## JSON Parameters

The `listAssetsEndpoint` parameter is required. All others are optional.

`listAssetsEndpoint` is a string with the endpoint URL providing an asset listing response for the project.

`editorDefaultToPreview` (Optional) is a boolean that indicates whether to preview transformations in the editor by default.

`editorDefaultCropType` (Optional) is a string defining the default crop mode. It must be one of the  following: "box", "zoom", "frame".

`editorDefaultResizeType` (Optional) is a string defining the default resize mode. It must be one of the following: "scale", "fit".

`colorPickerDefaultColors` (Optional) is an array of strings representing the default colors in hex. E.g. `["#RRGGBBAA", "#4caf50"]`.

```json
{
  "editorDefaultToPreview": true,
  "editorDefaultCropType": "box",
  "editorDefaultResizeType": "scale",
  "colorPickerDefaultColors": ["#RRGGBBAA", "#4caf50"]
}
```

## Saved Value

The value is saved as string representation of a serialized JSON object. The value contains an array of the selected image details. You can use the `transformedUrl` value to directly use the image with the transformations applied or you can reconstruct the transformation using the provided transform details. Some values, such as `descriptions` and `title` may be null or not present if the image didn't have those values at the time of selection. Most asset values, such as `imageHeight` and `imageWidth`, are the original asset values, not the the values after transformation.

```json
[
  {
    "fileName":"<asset_filename.ext>",
    "descriptions":[{
      "language":{
        "id": "<language_guid>"
        "codename": "language_codename"
      },
      "description": "<asset_description>"
    }],
    "id":"<asset_guid>",
    "imageHeight":360,
    "imageWidth":270,
    "name":"<asset_name>",
    "size":14485,
    "thumbnailUrl":"<asset_thumbnail_url>",
    "title":null,
    "type":"image/jpeg",
    "url":"<asset_base_url>",
    "transforms":{
      "crop":{
        "type":"box",
        "frame":{
          "wFloat":-1,
          "hFloat":-1
        },
        "box":{
          "xFloat":-1,
          "yFloat":-1,
          "wFloat":-1,
          "hFloat":-1
        },
        "zoom":{
          "xFloat":-1,
          "yFloat":-1,
          "zFloat":-1
        }
      },
      "resize":{
        "type":"fit",
        "scale":{
          "wFloat":-1,
          "hFloat":-1
        },
        "fit":{
          "wFloat":-1,
          "hFloat":-1
        },
        "devicePixelRatio":-1
      },
      "background":{
        "color":{
          "internalRgba":{
            "a":0,
            "r":0,
            "g":0,
            "b":0
          }
        }
      },
      "format":{
        "format":"Original",
        "autoWebp":false,
        "lossless":null,
        "quality":0
      }
    },
    "transformedUrl":"<asset_url_with_transformations>",
  },
]
```
