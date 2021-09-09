import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
);

async function addSlug( slug, url, failSafe, ttl ) {
    try { // check if the requested slug exists in KV store
        let link = await linkshort.get(slug);
    }
    catch{ // if slug does not exist (throws error), put requested slug into KV store
        if(ttl){ // if ttl is available, put slug with ttl
            await linkshort.put(slug, url, { expirationTtl: ttl });
        }
        else{ // if ttl not available, put slug w/o ttl
            await linkshort.put(slug, url);
        }

        return{
            slug: randomSlug,
        }
    }
    finally{ // if slug does exist, behave differently based on requested failure mode boolean
        switch(failSafe){
            case(true): // if failSafe === true, add random slug
                if(link){
                    let randomSlug = nanoid();

                    if(ttl){ // if ttl is available, put slug with ttl
                        await linkshort.put(randomSlug, url, { expirationTtl: ttl });
                    }
                    else{ // if ttl not available, put slug w/o ttl
                        await linkshort.put(randomSlug, url);
                    }

                    return{
                        slug: randomSlug,
                    }
                }

            case(false): // if failSafe === false, throw error
                if(link){
                    const error = new Error("Slug Already Exists")
                    console.log(error)
                    return error;
                }
        }
    }
}

export { addSlug };