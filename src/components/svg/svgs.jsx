import React from 'react';

const svgs = {
  arrow: (
    <svg viewBox="0 -960 960 960">
      <path d="M685-452H190q-13 0-21.5-8.5T160-482q0-13 8.5-21.5T190-512h495L537-660q-9-9-8.5-21t9.5-21q9-9 21-9t21 9l199 199q5 5 7 10t2 11q0 6-2 11t-7 10L581-263q-9 9-21 9t-21-9q-9-9-9-21.5t9-21.5l146-146Z" />
    </svg>
  ),
  logo: (
    <svg viewBox="0 0 187.836 38.117">
      <g fill="none" fillRule="evenodd">
        <rect width="52" height="22" x="135.836" fill="#397CE6" rx="4" />
        <g fill="#B2B6C2" fillRule="nonzero">
          <path d="M5.537 35.773H1.963L1.16 38H0l3.258-8.531h.984L7.506 38H6.352l-.815-2.227Zm-3.234-.925h2.9l-1.453-3.99-1.447 3.99ZM24.044 36.88c-.29.415-.693.725-1.21.93-.518.205-1.12.307-1.808.307-.695 0-1.312-.163-1.851-.489a3.26 3.26 0 0 1-1.251-1.392c-.295-.601-.447-1.298-.454-2.091V33.4c0-1.285.3-2.28.899-2.988.6-.707 1.442-1.06 2.528-1.06.891 0 1.608.227 2.15.682.544.455.876 1.1.997 1.937h-1.125c-.211-1.13-.883-1.694-2.016-1.694-.754 0-1.325.265-1.714.794-.388.53-.585 1.296-.589 2.3v.697c0 .957.22 1.718.657 2.283.437.564 1.029.846 1.775.846.422 0 .791-.047 1.108-.14.316-.094.578-.252.785-.475v-1.916H20.95v-.914h3.094v3.129ZM33.801 34.057h-3.697v3.024h4.295V38h-5.42v-8.531h5.361v.926h-4.236v2.742h3.697zM45.416 38h-1.131l-4.295-6.574V38h-1.131v-8.531h1.131l4.307 6.604v-6.604h1.119zM55.296 34.057h-3.697v3.024h4.295V38h-5.42v-8.531h5.361v.926h-4.236v2.742h3.697zM65.065 35.773h-3.574L60.688 38h-1.16l3.258-8.531h.984L67.034 38H65.88l-.815-2.227Zm-3.234-.925h2.9l-1.453-3.99-1.447 3.99ZM72.373 37.08h4.043V38h-5.174v-8.531h1.131zM86.94 34.01c0 .836-.14 1.565-.42 2.188-.282.623-.68 1.099-1.196 1.427-.516.328-1.117.492-1.805.492-.672 0-1.268-.165-1.787-.495-.52-.33-.923-.8-1.21-1.412-.287-.611-.435-1.32-.442-2.124v-.615c0-.82.142-1.545.427-2.174.285-.629.689-1.11 1.21-1.444.522-.334 1.118-.501 1.79-.501.684 0 1.286.165 1.808.495.521.33.923.808 1.204 1.435.281.627.422 1.357.422 2.189v.539Zm-1.118-.551c0-1.012-.203-1.788-.61-2.33-.406-.54-.974-.81-1.705-.81-.71 0-1.27.27-1.678.81-.409.542-.619 1.293-.63 2.254v.627c0 .98.206 1.75.618 2.311.412.56.98.841 1.702.841.727 0 1.29-.265 1.688-.794.398-.53.603-1.288.615-2.276v-.633ZM97.987 36.88c-.289.415-.692.725-1.21.93-.517.205-1.12.307-1.807.307-.696 0-1.313-.163-1.852-.489a3.26 3.26 0 0 1-1.25-1.392c-.296-.601-.447-1.298-.455-2.091V33.4c0-1.285.3-2.28.9-2.988.6-.707 1.442-1.06 2.528-1.06.89 0 1.607.227 2.15.682.543.455.875 1.1.996 1.937h-1.125c-.21-1.13-.883-1.694-2.015-1.694-.754 0-1.326.265-1.714.794-.389.53-.585 1.296-.59 2.3v.697c0 .957.22 1.718.657 2.283.438.564 1.03.846 1.776.846.421 0 .79-.047 1.107-.14.316-.094.578-.252.785-.475v-1.916h-1.974v-.914h3.093v3.129ZM105.524 33.752l2.226-4.283h1.278l-2.942 5.35v3.18h-1.125v-3.18l-2.941-5.35h1.289zM120.345 34.66V38h-1.125v-8.531h3.146c.934 0 1.666.238 2.195.715.53.476.794 1.107.794 1.892 0 .828-.259 1.466-.777 1.913-.517.448-1.258.671-2.223.671h-2.01Zm0-.92h2.021c.602 0 1.063-.141 1.383-.425.32-.283.48-.692.48-1.227 0-.508-.16-.914-.48-1.219-.32-.305-.76-.463-1.318-.474h-2.086v3.345ZM132.98 34.549h-2.005V38h-1.13v-8.531h2.824c.96 0 1.7.219 2.217.656.518.438.777 1.074.777 1.91 0 .531-.144.994-.43 1.389-.288.394-.687.69-1.2.885l2.005 3.62V38h-1.207l-1.852-3.451Zm-2.005-.92h1.729c.558 0 1.003-.145 1.333-.434.33-.289.495-.675.495-1.16 0-.527-.157-.931-.472-1.213-.314-.28-.768-.424-1.362-.427h-1.723v3.234ZM146.861 34.01c0 .836-.14 1.565-.421 2.188-.282.623-.68 1.099-1.196 1.427-.515.328-1.117.492-1.804.492-.672 0-1.268-.165-1.787-.495-.52-.33-.923-.8-1.21-1.412-.288-.611-.435-1.32-.443-2.124v-.615c0-.82.143-1.545.428-2.174.285-.629.688-1.11 1.21-1.444.521-.334 1.118-.501 1.79-.501.683 0 1.286.165 1.808.495.521.33.922.808 1.204 1.435.28.627.421 1.357.421 2.189v.539Zm-1.119-.551c0-1.012-.203-1.788-.609-2.33-.406-.54-.975-.81-1.705-.81-.711 0-1.27.27-1.679.81-.408.542-.618 1.293-.63 2.254v.627c0 .98.206 1.75.618 2.311.413.56.98.841 1.703.841.726 0 1.289-.265 1.687-.794.399-.53.604-1.288.615-2.276v-.633ZM155.183 29.469h1.131v6.04c0 .817-.245 1.456-.735 1.917-.49.46-1.144.691-1.96.691-.848 0-1.508-.217-1.98-.65-.473-.434-.71-1.041-.71-1.822h1.125c0 .488.134.869.402 1.142.267.274.655.41 1.163.41.465 0 .84-.146 1.128-.44.287-.292.432-.702.436-1.23V29.47ZM166.112 34.057h-3.697v3.024h4.295V38h-5.42v-8.531h5.361v.926h-4.236v2.742h3.697zM177.446 35.293c-.106.902-.439 1.599-1 2.089-.56.49-1.305.735-2.235.735-1.007 0-1.815-.361-2.422-1.084-.608-.722-.912-1.69-.912-2.9v-.82c0-.793.142-1.49.425-2.092.283-.602.685-1.064 1.204-1.386.52-.322 1.121-.483 1.805-.483.906 0 1.633.253 2.18.758.547.506.865 1.206.955 2.101h-1.131c-.098-.68-.31-1.172-.636-1.477-.326-.304-.782-.457-1.368-.457-.719 0-1.282.266-1.69.797-.409.532-.613 1.287-.613 2.268v.826c0 .926.194 1.662.58 2.209.387.547.928.82 1.623.82.625 0 1.105-.141 1.439-.425.334-.283.556-.776.665-1.479h1.13ZM187.766 30.395h-2.743V38h-1.119v-7.605h-2.736v-.926h6.598z" />
        </g>
        <g fill="#FFF" fillRule="nonzero">
          <path d="M141.72 16.827v-1.348l1.309-.247V6.574h-2.326l-.158 1.48h-1.71V4.855h10.67v3.199h-1.717l-.16-1.48h-2.332v8.658l1.317.247v1.348zM152.951 17c-.906 0-1.618-.234-2.138-.703-.52-.469-.78-1.111-.78-1.928 0-.56.155-1.051.463-1.476.309-.425.764-.757 1.367-.995.603-.239 1.338-.358 2.205-.358h1.284v-.699c0-.45-.135-.811-.405-1.085-.27-.274-.665-.411-1.187-.411-.284 0-.538.034-.763.103a2.087 2.087 0 0 0-.604.291l-.192 1.193h-1.65l-.017-2.253a6.705 6.705 0 0 1 1.504-.662 6.248 6.248 0 0 1 1.83-.251c1.161 0 2.077.267 2.746.802.67.534 1.005 1.3 1.005 2.298v3.79c0 .121.001.239.004.354.003.115.012.228.029.337l.925.132v1.348h-2.875a9.602 9.602 0 0 1-.171-.522 3.317 3.317 0 0 1-.113-.538 3.56 3.56 0 0 1-1.054.892c-.409.227-.88.341-1.413.341Zm.559-1.686a2.3 2.3 0 0 0 1.079-.263c.336-.175.59-.397.763-.666v-1.447h-1.292c-.584 0-1.024.133-1.321.399-.298.266-.446.58-.446.941 0 .33.105.584.316.765.211.18.512.271.9.271ZM159.573 16.827v-1.348l1.217-.247V5.603l-1.31-.246V4h3.577v11.232l1.217.247v1.348zM165.187 16.827V15.48l1.216-.247V5.603l-1.308-.246V4h3.567v11.232l1.117.247v1.348h-4.592Zm5.75 0v-1.299l.742-.148-.016-.033-1.967-2.582 1.408-1.513 3.101 3.98 1.159.247v1.348h-4.426Zm-2.5-2.458-1.05-1.332 3.917-3.602.025-.033-.933-.123V7.93h4.517v1.357l-1.158.28-5.318 4.802ZM180.227 17a8.718 8.718 0 0 1-1.846-.185 8.626 8.626 0 0 1-1.672-.547l-.025-2.434h1.6l.318 1.283c.216.099.444.175.683.23.239.055.508.082.808.082.573 0 .977-.094 1.213-.283a.875.875 0 0 0 .354-.711c0-.275-.125-.512-.375-.712-.25-.2-.733-.374-1.45-.522-1.072-.225-1.861-.563-2.367-1.015-.506-.453-.759-1.032-.759-1.74 0-.493.13-.94.388-1.34.258-.4.646-.722 1.163-.966s1.164-.366 1.942-.366c.683 0 1.299.069 1.846.206.547.137 1.01.312 1.388.526l.041 2.352h-1.591l-.259-1.168a1.86 1.86 0 0 0-.567-.267 2.626 2.626 0 0 0-.733-.095c-.445 0-.79.093-1.038.28-.247.186-.37.422-.37.707 0 .164.04.315.124.452.084.137.246.265.488.383.242.117.596.228 1.063.333 1.144.257 1.97.6 2.48 1.027.508.428.762 1.01.762 1.744 0 .81-.299 1.471-.896 1.981s-1.502.765-2.713.765Z" />
        </g>
        <g fill="#343434" fillRule="nonzero">
          <path d="M.578 19v-.85l1.592-.126V5.768L.578 5.64v-.86h10.527v3.116h-.996l-.097-2.14h-6.67v5.587h5.791v.986h-5.79v5.694l1.59.127V19zM15.122 19.205c-1.002 0-1.787-.267-2.353-.8-.567-.535-.85-1.257-.85-2.169 0-.65.189-1.222.567-1.714.377-.491.913-.874 1.606-1.147.693-.273 1.515-.41 2.466-.41h2.187v-1.211c0-.762-.226-1.375-.678-1.84-.453-.466-1.135-.7-2.046-.7a3.63 3.63 0 0 0-1.382.25c-.407.166-.76.376-1.06.63l-.097 1.611h-.967V9.498a5.32 5.32 0 0 1 1.553-.923c.579-.224 1.237-.337 1.972-.337 1.244 0 2.2.313 2.871.938.67.625 1.006 1.49 1.006 2.597v5.098c0 .208.007.415.02.62.013.205.036.409.068.61l1.26.05V19H18.96a12.947 12.947 0 0 1-.161-.928 7.829 7.829 0 0 1-.054-.79 4.472 4.472 0 0 1-1.523 1.386 4.182 4.182 0 0 1-2.1.537Zm.137-1.025c.723 0 1.408-.19 2.056-.572.647-.38 1.124-.887 1.43-1.518v-2.227h-2.197c-1.08 0-1.927.233-2.539.698-.612.466-.918 1.037-.918 1.714 0 .567.195 1.026.586 1.377.39.352.918.528 1.582.528ZM22.088 19v-.85l1.592-.127V9.42l-1.592-.127v-.86h2.637l.098 1.807a3.661 3.661 0 0 1 1.342-1.474c.57-.352 1.249-.528 2.037-.528.813 0 1.49.2 2.03.6.541.401.929 1.015 1.163 1.842.3-.762.747-1.361 1.343-1.797.595-.436 1.316-.655 2.163-.655 1.126 0 1.997.376 2.612 1.128.615.752.923 1.913.923 3.482v5.176l1.592.127v.85h-4.366v-.85l1.592-.127v-5.196c0-1.308-.23-2.233-.688-2.773-.46-.54-1.096-.81-1.91-.81-.917 0-1.624.29-2.119.873-.494.583-.79 1.32-.888 2.212v5.703l1.592.127V19h-4.366v-.85l1.592-.127v-5.205c0-1.282-.233-2.199-.698-2.749-.466-.55-1.105-.825-1.919-.825-.86 0-1.528.228-2.007.684-.478.455-.806 1.06-.981 1.816v6.28l1.591.126V19h-4.365ZM40.685 19v-.85l1.592-.127V9.42l-1.592-.127v-.86h2.764v9.59l1.592.127V19h-4.356ZM42.14 5.455v-1.69h1.309v1.69H42.14ZM46.08 19v-.85l1.591-.126V4.752l-1.592-.127v-.86h2.763v14.259l1.592.127V19zM53.533 23.268c-.137 0-.3-.015-.493-.044a4.386 4.386 0 0 1-.435-.083l.137-.967a9.389 9.389 0 0 0 .752.068c.508 0 .912-.167 1.211-.503.3-.335.573-.812.82-1.43l.547-1.436-3.877-9.512-1.142-.068v-.86h3.72v.86l-1.337.088 2.714 6.816.44 1.201h.058l3.018-8.017-1.377-.088v-.86h3.691v.86l-1.123.068L56.521 20.7a7.896 7.896 0 0 1-.664 1.328c-.247.39-.556.695-.927.913-.371.219-.837.328-1.397.328ZM66.47 19v-.85l1.591-.126V5.768L66.47 5.64v-.86h4.355v.86l-1.59.127v5.693h8.026V5.768l-1.592-.127v-.86h4.356v.86l-1.592.127v12.256l1.592.127V19h-4.356v-.85l1.592-.126v-5.576h-8.027v5.576l1.591.127V19zM80.828 19v-.85l1.592-.127V9.42l-1.592-.127v-.86h2.763v9.59l1.592.127V19h-4.355Zm1.455-13.545v-1.69h1.308v1.69h-1.308ZM90.372 19.205c-.742 0-1.43-.1-2.066-.298a6.845 6.845 0 0 1-1.792-.864l-.01-2.168h.958l.166 1.553a3.65 3.65 0 0 0 1.26.634c.462.13.957.196 1.484.196.885 0 1.56-.192 2.021-.576.463-.384.694-.84.694-1.368 0-.494-.207-.932-.62-1.313-.414-.38-1.148-.689-2.203-.923-1.263-.273-2.176-.638-2.739-1.094-.563-.455-.845-1.09-.845-1.904 0-.534.15-1.016.45-1.445.3-.43.724-.77 1.274-1.02.55-.251 1.196-.377 1.939-.377.774 0 1.448.113 2.021.337a4.663 4.663 0 0 1 1.475.903l.048 2.168h-.957l-.136-1.562a3.108 3.108 0 0 0-1.026-.65c-.39-.152-.866-.229-1.425-.229-.795 0-1.407.184-1.836.552-.43.368-.645.796-.645 1.284 0 .319.067.597.2.835.134.238.39.45.772.64.38.188.936.367 1.665.537 1.321.3 2.278.704 2.87 1.216.593.51.89 1.173.89 1.987 0 .86-.334 1.566-1.001 2.119-.668.553-1.63.83-2.886.83ZM99.33 19.186c-.742 0-1.318-.23-1.728-.689-.41-.459-.616-1.2-.616-2.222V9.381H95.16v-.947h1.826V5.719h1.172v2.715h2.461v.947h-2.46v6.894c0 .703.125 1.21.375 1.519.25.31.584.464 1.001.464.221 0 .44-.015.654-.044.215-.03.437-.06.664-.093l.176.84a4.94 4.94 0 0 1-.8.166c-.3.039-.6.059-.899.059ZM106.472 19.205c-.95 0-1.776-.226-2.476-.679-.7-.452-1.243-1.08-1.63-1.884-.388-.804-.582-1.724-.582-2.76v-.321c0-1.036.194-1.954.581-2.754.388-.801.931-1.43 1.631-1.885.7-.456 1.519-.684 2.456-.684.944 0 1.766.228 2.466.684.7.456 1.244 1.082 1.631 1.88.387.797.581 1.717.581 2.759v.322c0 1.041-.194 1.963-.581 2.763-.387.801-.931 1.428-1.63 1.88-.7.453-1.516.68-2.447.68Zm0-.977c.723 0 1.344-.192 1.865-.576.52-.384.921-.905 1.201-1.562.28-.658.42-1.393.42-2.207v-.322c0-.808-.14-1.54-.42-2.198-.28-.657-.682-1.178-1.206-1.562-.524-.384-1.15-.576-1.88-.576-.729 0-1.355.192-1.88.576-.524.384-.924.905-1.2 1.562-.277.658-.416 1.39-.416 2.198v.322c0 .82.139 1.557.415 2.212.277.654.677 1.173 1.201 1.557.525.384 1.158.576 1.9.576ZM112.12 19v-.85l1.591-.127V9.42l-1.591-.127v-.86h2.617l.127 1.612.01.283c.299-.657.706-1.17 1.22-1.538.514-.368 1.13-.552 1.846-.552.176 0 .363.015.561.044.199.03.344.06.435.093l-.147 1.074-1.084-.068c-.748-.02-1.36.195-1.835.644-.476.45-.805 1.045-.987 1.787v6.211l1.592.127V19h-4.355ZM121.859 23.268c-.137 0-.301-.015-.493-.044a4.386 4.386 0 0 1-.435-.083l.137-.967a9.388 9.388 0 0 0 .752.068c.508 0 .911-.167 1.21-.503.3-.335.574-.812.821-1.43l.547-1.436-3.877-9.512-1.143-.068v-.86h3.721v.86l-1.338.088 2.715 6.816.44 1.201h.058l3.018-8.017-1.377-.088v-.86h3.691v.86l-1.123.068-4.336 11.338a7.896 7.896 0 0 1-.664 1.328c-.247.39-.556.695-.928.913-.37.219-.836.328-1.396.328Z" />
        </g>
      </g>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 119.783 119">
      <g fill="none" fillRule="evenodd">
        <path fill="#D9DEEE" d="M0 0h119v119H0z" />
        <path
          fill="#ACB1C4"
          d="M60 81c26.44 0 49.25 15.548 59.783 38H.217C10.75 96.547 33.56 81 60 81Z"
        />
        <circle cx="59.5" cy="45.5" r="23.5" fill="#ACB1C4" />
      </g>
    </svg>
  ),
};

export default svgs;
