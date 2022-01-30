const embed = ({author_name, author_image, author_url, title, url, description, fields, footer, color}) => {
    return `
<div class="xxx">
    <div class="wrapper">
    <div class="side-colored" style="background-color: ${'#' + (color).toString(16)};"></div>
        <div class="card embed">
            <div class="card-block">
                <div class="embed-inner">
                    ${(typeof author_name !== "undefined" ? `
                        <div class="embed-author">
                            ${(typeof author_image !== "undefined" ? `<img class="embed-author-icon" src="${author_image}" alt="${author_name}">` : ``)}
                            ${(typeof author_name !== "undefined" ? `<a class="embed-author-name" href="${author_url || ''}">${author_name}</a>` : ``)}
                        </div>
                    ` : '')}

                    ${(typeof title !== "undefined" ? `<div class="embed-title"><a href="${url || ''}">${title}</a></div>` : '')}
                    ${(typeof description !== "undefined" ? `<div class="embed-description"><p>${description}</p></div>` : '')}
                    ${fields?.length > 0 ? `
                    <div class="fields">
                        ${fields.map(r => `
                            <div class="field">
                                <div class="field-name">${r.name}</div>
                                <div class="field-value">
                                    <p>${r.value}</p>
                                </div>
                            </div>
                        `).join("\n")}
                    </div>` : ''}
                </div>
            </div>
            ${(typeof footer !== "undefined" ? `<div class="embed-footer"><span>${footer}</span></div>` : '')}
        </div>
    </div>
</div>`
}

module.exports = {
    embed
}
