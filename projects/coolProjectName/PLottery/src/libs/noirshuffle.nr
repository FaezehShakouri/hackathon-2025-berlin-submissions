use poseidon::poseidon;

/**
 * Compute the next perfect square of `n`, unless it's already a perfect square.
 * @param n input
 */
pub fn next_perfect_square(n: u64) -> u64 {
    let sqrtN: u64 = usqrt(n);
    let mut out: u64 = 0;
    if (sqrtN * sqrtN == n) {
        out = n;
    } else {
        let sqrtN_plus_one = sqrtN + 1;
        out = sqrtN_plus_one * sqrtN_plus_one;
    }
    out
}

pub fn next_perfect_square_root(n: u64) -> u64 {
    let sqrtN: u64 = usqrt(n);
    let mut out: u64 = 0;
    if (sqrtN * sqrtN == n) {
        out = sqrtN;
    } else {
        out = sqrtN + 1;
    }
    out
}

pub fn usqrt(s: u64) -> u64 {
    let mut z = 0;
    if (s > 3) {
        z = s;
        let mut x = s / 2 + 1;
        for _ in 0..36 {
            //0 .. 36 should be enough for u64 (is the upper bound for u64 36 because: Math.log2(64) ** 2 = 36???)
            if x < z {
                z = x;
                x = (s / x + x) / 2;
            }
        }
    } else if (s != 0) {
        z = 1;
    }
    z
}

pub fn shuffle(_x: u64, domain: u64, seed: Field, rounds: u64) -> u64 {
    assert(domain != 0, "modulus must be > 0");
    assert(_x < domain, "_x too large");
    assert((rounds & 1) == 0, "rounds must be even");

    let h = next_perfect_square_root(domain);

    let mut x = _x;
    let mut needs_permute = true;
    //https://github.com/kevincharm/gfc-fpe/tree/master?tab=readme-ov-file#iteration-bounds
    for _ in 0..3 {
        // TODO find the actual upperbound of this loop (is it 3?)
        if (needs_permute) {
            let mut L = x % h;
            let mut R = x / h;
            for i in 0..rounds {
                let hash = poseidon::bn254::hash_4([R as Field, i as Field, seed, domain as Field]);
                let nextR = (L + hash as u64) % h;
                L = R;
                R = nextR;
            }
            x = h * R + L;
            needs_permute = x >= domain;
        }
    }
    x
}

#[test]
fn test_sqrt() {
    let test_cases: [(u64, u64); 6] = [(0, 0), (1, 1), (2, 1), (3, 1), (4, 2), (15, 3)];

    for i in 0..6 {
        let (input, expected) = test_cases[i];
        let result = usqrt(input);

        println(f"sqrt({input}) = {result}, expected {expected}");
        assert(result == expected, f"sqrt({input}) = {result}, expected {expected}");
        assert((result * result) <= input, "result^2 must be <= input");
        assert((result + 1) * (result + 1) > input, "(result+1)^2 must be > input");
    }
}

fn main(
    x: pub u64,
    domain: pub u64,
    seed: pub Field,
    //rounds:pub u64, // could be hardcoded
) -> pub u64 {
    shuffle(x, domain, seed, 4)
}

#[test]
fn test_shuffle() {
    let seed = 0x1234; //random seed that will be requested
    let domain = 10; 

    let mut shuffledIndexes: [u64; 10] = [0; 10];
    for index in 0..domain {
        let shuffledIndex = main(index, domain, seed);
        shuffledIndexes[index as u32] = shuffledIndex;

        assert(shuffledIndex < domain, "shuffledIndex outside of domain");
        println(shuffledIndex);
    }

    let sorted_shuffledIndexes = shuffledIndexes.sort();
    for index in 0..domain {
        assert(sorted_shuffledIndexes[index as u32] == index, "fuck");
    }
}
